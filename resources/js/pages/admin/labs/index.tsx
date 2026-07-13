import { Head, router, useHttp } from '@inertiajs/react';
import {
    Activity,
    ArrowUpDown,
    BarChart3,
    CheckCircle,
    Filter,
    FlaskConical,
    Globe,
    RefreshCw,
    Target,
    Trophy,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { DateRangePicker } from '@/components/date-range-picker';
import type { SimpleDateRange } from '@/components/date-range-picker';
import { AudienceSegmentation } from '@/components/labs/audience-segmentation';
import { CtaAnalysis } from '@/components/labs/cta-analysis';
import { DeviceComparison } from '@/components/labs/device-comparison';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AdminLayout from '@/layouts/admin-layout';
import {
    formatCurrency,
    formatDuration,
    formatNumber,
    formatPercent,
    toSafeArray,
} from '@/lib/safe-data';
import type {
    FunnelItem,
    LabsPageProps,
    MatrixItem,
    QualityMetrics,
} from '@/types/analytics';

const PAGE_FILTER_STORAGE_KEY = 'labs_page_filter';

const normalizePath = (source: string): string => {
    try {
        if (source.startsWith('http://') || source.startsWith('https://')) {
            return new URL(source).pathname;
        }
    } catch {
        // ignore invalid URLs
    }

    return source.startsWith('/') ? source : `/${source}`;
};

const CHART_COLORS = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
];

const FUNNEL_STAGES = ['Visits', 'Engaged', 'Intent', 'Initiate Checkout', 'Leads', 'Sales'];

const transformFunnelData = (
    funnel: FunnelItem[],
    selectedSources: string[],
) => {
    if (funnel.length === 0 || selectedSources.length === 0) {
        return [];
    }

    return FUNNEL_STAGES.map((stage) => {
        const dataPoint: Record<string, string | number> = { name: stage };
        selectedSources.forEach((source) => {
            const funnelItem = funnel.find((f) => f.landing_source === source);
            const step = toSafeArray(funnelItem?.steps).find(
                (s) => s.stage === stage,
            );
            dataPoint[source] = step?.count ?? 0;
        });

        return dataPoint;
    });
};

export default function LabsIndex({
    matrix: rawMatrix,
    funnel: rawFunnel,
    quality: rawQuality,
    devices: rawDevices,
    cta: rawCta,
    readers: rawReaders,
    heatmap: rawHeatmap,
    section_heatmap: rawSectionHeatmap,
    availableSources: rawAvailableSources,
    filters,
}: LabsPageProps) {
    const matrix = toSafeArray<MatrixItem>(rawMatrix);
    const funnel = toSafeArray<FunnelItem>(rawFunnel);
    const quality = toSafeArray(rawQuality);
    const devices = toSafeArray(rawDevices);
    const cta = toSafeArray(rawCta);
    const readers = toSafeArray(rawReaders);
    const heatmap = toSafeArray(rawHeatmap);
    const sectionHeatmap = toSafeArray(rawSectionHeatmap);
    const availableSources = toSafeArray<string>(rawAvailableSources);

    const availablePages = useMemo(
        () =>
            [
                ...new Set(matrix.map((m) => normalizePath(m.landing_source))),
            ].sort(),
        [matrix],
    );

    const [selectedPages, setSelectedPages] = useState<string[]>(() => {
        if (typeof window === 'undefined') {
            return [];
        }

        try {
            const stored = localStorage.getItem(PAGE_FILTER_STORAGE_KEY);

            if (stored) {
                const parsed = JSON.parse(stored) as string[];

                return parsed.filter((p) => availablePages.includes(p));
            }
        } catch {
            // ignore malformed JSON
        }

        return [];
    });

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        localStorage.setItem(
            PAGE_FILTER_STORAGE_KEY,
            JSON.stringify(selectedPages),
        );
    }, [selectedPages]);

    const togglePage = (page: string) => {
        setSelectedPages((prev) =>
            prev.includes(page)
                ? prev.filter((p) => p !== page)
                : [...prev, page],
        );
    };

    const clearPageFilter = () => setSelectedPages([]);

    const isPageFiltered = selectedPages.length > 0;
    const pageMatch = (source: string) =>
        !isPageFiltered || selectedPages.includes(normalizePath(source));

    const filteredMatrix = useMemo(
        () => matrix.filter((m) => pageMatch(m.landing_source)),
        [matrix, selectedPages],
    );
    const filteredFunnel = useMemo(
        () => funnel.filter((f) => pageMatch(f.landing_source)),
        [funnel, selectedPages],
    );
    const filteredQuality = useMemo(
        () => quality.filter((q) => pageMatch(q.landing_source)),
        [quality, selectedPages],
    );
    const filteredDevices = useMemo(
        () => devices.filter((d) => pageMatch(d.landing_source)),
        [devices, selectedPages],
    );
    const filteredCta = useMemo(
        () => cta.filter((c) => pageMatch(c.landing_source)),
        [cta, selectedPages],
    );
    const filteredReaders = useMemo(
        () => readers.filter((r) => pageMatch(r.landing_source)),
        [readers, selectedPages],
    );
    const filteredHeatmap = useMemo(
        () => heatmap.filter((h) => pageMatch(h.landing_source)),
        [heatmap, selectedPages],
    );
    const filteredSectionHeatmap = useMemo(
        () => sectionHeatmap.filter((s) => pageMatch(s.landing_source)),
        [sectionHeatmap, selectedPages],
    );

    const http = useHttp({
        range: filters.range,
        source: filters.source ?? '',
        start_date: filters.start_date,
        end_date: filters.end_date,
    });

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [sortColumn, setSortColumn] = useState<keyof MatrixItem>('rpv');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [toast, setToast] = useState<{
        message: string;
        type: 'success' | 'error';
    } | null>(null);
    const [dateRange, setDateRange] = useState<SimpleDateRange | undefined>(
        filters.start_date && filters.end_date
            ? { from: filters.start_date, to: filters.end_date }
            : undefined,
    );
    const [selectedFunnelSources, setSelectedFunnelSources] = useState<
        string[]
    >(() => matrix.slice(0, 2).map((m) => m.landing_source));

    const triggerToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const winner = useMemo(() => {
        if (filteredMatrix.length === 0) {
            return null;
        }

        return filteredMatrix.reduce((prev, curr) =>
            curr.rpv > prev.rpv ? curr : prev,
        );
    }, [filteredMatrix]);

    const sortedMatrix = useMemo(() => {
        return [...filteredMatrix].sort((a, b) => {
            const aVal = a[sortColumn] as number;
            const bVal = b[sortColumn] as number;

            return sortDirection === 'asc'
                ? aVal > bVal
                    ? 1
                    : -1
                : aVal < bVal
                  ? 1
                  : -1;
        });
    }, [filteredMatrix, sortColumn, sortDirection]);

    const chartData = useMemo(
        () => transformFunnelData(filteredFunnel, selectedFunnelSources),
        [filteredFunnel, selectedFunnelSources],
    );

    const handleRangeChange = (value: string) => {
        router.get(
            '/admin/labs',
            { range: value, source: filters.source || undefined },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const handleDateUpdate = (date: SimpleDateRange | undefined) => {
        setDateRange(date);

        if (date?.from && date?.to) {
            router.get(
                '/admin/labs',
                {
                    range: 'custom',
                    start_date: date.from,
                    end_date: date.to,
                    source: filters.source || undefined,
                },
                { preserveState: true, preserveScroll: true, replace: true },
            );
        }
    };

    const handleSourceChange = (value: string) => {
        router.get(
            '/admin/labs',
            {
                range: filters.range,
                source: value === 'all' ? undefined : value,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const handleRefreshCache = () => {
        setIsRefreshing(true);
        http.post('/admin/labs/clear-cache', {
            onSuccess: () => {
                triggerToast('Data cached successfully', 'success');
                router.reload();
            },
            onError: () => triggerToast('Failed to refresh cache', 'error'),
            onFinish: () => setIsRefreshing(false),
        });
    };

    const handleSort = (column: keyof MatrixItem) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('desc');
        }
    };

    const toggleFunnelSource = (source: string) => {
        setSelectedFunnelSources((prev) =>
            prev.includes(source)
                ? prev.filter((s) => s !== source)
                : [...prev, source],
        );
    };

    const hasData = matrix.length > 0;

    return (
        <AdminLayout>
            <Head title="A/B Testing Labs" />

            <div className="container mx-auto space-y-8 p-4 md:p-6">
                {toast && (
                    <div className="animate-fade-in fixed top-20 right-4 z-50 w-auto max-w-sm">
                        <Alert
                            className={
                                toast.type === 'success'
                                    ? 'border-primary/50 bg-primary/10'
                                    : 'border-destructive/50 bg-destructive/10'
                            }
                        >
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>{toast.message}</AlertDescription>
                        </Alert>
                    </div>
                )}

                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                            <FlaskConical className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                                A/B Testing Labs
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Optimize your landing page performance
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <Select
                                value={filters.source || 'all'}
                                onValueChange={handleSourceChange}
                            >
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="All Sources" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Sources
                                    </SelectItem>
                                    {availableSources.map((source) => (
                                        <SelectItem key={source} value={source}>
                                            {source === 'direct'
                                                ? 'Direct Traffic'
                                                : source}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {availablePages.length > 1 && (
                            <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <Select
                                    value={
                                        selectedPages.length === 1
                                            ? selectedPages[0]
                                            : '__multi__'
                                    }
                                    onValueChange={(val) => {
                                        if (val === '__all__') {
                                            clearPageFilter();
                                        } else {
                                            togglePage(val);
                                        }
                                    }}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue>
                                            {selectedPages.length === 0
                                                ? 'All Pages'
                                                : selectedPages.length === 1
                                                  ? selectedPages[0]
                                                  : `${selectedPages.length} pages`}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__all__">
                                            All Pages
                                        </SelectItem>
                                        {availablePages.map((page) => (
                                            <SelectItem key={page} value={page}>
                                                <span className="flex items-center gap-2">
                                                    <span
                                                        className={`inline-block h-2 w-2 rounded-full ${
                                                            selectedPages.includes(
                                                                page,
                                                            )
                                                                ? 'bg-primary'
                                                                : 'bg-muted-foreground/30'
                                                        }`}
                                                    />
                                                    {page}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {isPageFiltered && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={clearPageFilter}
                                        className="h-8 w-8"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        )}

                        <Select
                            value={filters.range}
                            onValueChange={handleRangeChange}
                        >
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Select range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="3">Last 3 Days</SelectItem>
                                <SelectItem value="5">Last 5 Days</SelectItem>
                                <SelectItem value="7">Last 7 Days</SelectItem>
                                <SelectItem value="14">Last 14 Days</SelectItem>
                                <SelectItem value="30">Last 30 Days</SelectItem>
                                <SelectItem value="custom">
                                    Custom Range
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        {filters.range === 'custom' && (
                            <DateRangePicker
                                date={dateRange}
                                onUpdate={handleDateUpdate}
                            />
                        )}

                        <Button
                            variant="outline"
                            type="button"
                            onClick={handleRefreshCache}
                            disabled={isRefreshing}
                            className="gap-2"
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
                            />
                            <span className="hidden sm:inline">
                                Refresh Data
                            </span>
                        </Button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span>
                        Showing data from{' '}
                        <span className="font-medium text-foreground">
                            {filters.start_date}
                        </span>{' '}
                        to{' '}
                        <span className="font-medium text-foreground">
                            {filters.end_date}
                        </span>
                    </span>
                    {filters.source && (
                        <Badge variant="secondary" className="gap-1">
                            <Filter className="h-3 w-3" />
                            {filters.source === 'direct'
                                ? 'Direct Traffic'
                                : filters.source}
                        </Badge>
                    )}
                    {isPageFiltered && (
                        <Badge variant="secondary" className="gap-1">
                            <Globe className="h-3 w-3" />
                            {selectedPages.length} page
                            {selectedPages.length > 1 ? 's' : ''} selected
                        </Badge>
                    )}
                </div>

                {!hasData ? (
                    <Card className="py-16 text-center">
                        <CardContent>
                            <BarChart3 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="text-lg font-semibold text-foreground">
                                No Analytics Data
                            </h3>
                            <p className="mt-2 text-muted-foreground">
                                There's no data available for the selected
                                filters yet.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Trophy className="h-5 w-5 text-primary" />
                                    <div>
                                        <CardTitle>
                                            Performance Matrix
                                        </CardTitle>
                                        <CardDescription>
                                            Landing page comparison sorted by
                                            Revenue Per Visit
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-border">
                                                <th className="p-4 text-left font-medium text-muted-foreground">
                                                    Source
                                                </th>
                                                {(
                                                    [
                                                        ['visits', 'Visits'],
                                                        [
                                                            'bounce_rate',
                                                            'Bounce',
                                                        ],
                                                        [
                                                            'intent_rate',
                                                            'Intent',
                                                        ],
                                                        ['lead_cr', 'Conv. CR'],
                                                        [
                                                            'strict_cr',
                                                            'Sales CR',
                                                        ],
                                                        ['rpv', 'RPV'],
                                                    ] as const
                                                ).map(([key, label]) => (
                                                    <th
                                                        key={key}
                                                        className="p-4 text-left font-medium text-muted-foreground"
                                                    >
                                                        <button
                                                            onClick={() =>
                                                                handleSort(key)
                                                            }
                                                            className="flex items-center gap-1 hover:text-foreground"
                                                        >
                                                            {label}{' '}
                                                            <ArrowUpDown className="h-3 w-3" />
                                                        </button>
                                                    </th>
                                                ))}
                                                <th className="p-4 text-left font-medium text-muted-foreground">
                                                    Revenue
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sortedMatrix.map((item) => {
                                                const isWinner =
                                                    winner &&
                                                    item.landing_source ===
                                                        winner.landing_source;

                                                return (
                                                    <tr
                                                        key={
                                                            item.landing_source
                                                        }
                                                        className="border-b border-border transition hover:bg-muted/50"
                                                    >
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-mono font-medium text-foreground">
                                                                    {
                                                                        item.landing_source
                                                                    }
                                                                </span>
                                                                {isWinner && (
                                                                    <Badge
                                                                        variant="default"
                                                                        className="gap-1 bg-chart-4 text-foreground"
                                                                    >
                                                                        <Trophy className="h-3 w-3" />{' '}
                                                                        Winner
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="p-4 text-foreground">
                                                            {formatNumber(
                                                                item.visits,
                                                            )}
                                                        </td>
                                                        <td className="p-4 text-foreground">
                                                            {formatPercent(
                                                                item.bounce_rate,
                                                                1,
                                                            )}
                                                            %
                                                        </td>
                                                        <td className="p-4 text-foreground">
                                                            {formatPercent(
                                                                item.intent_rate,
                                                                2,
                                                            )}
                                                            %
                                                        </td>
                                                        <td className="p-4">
                                                            <Badge variant="secondary">
                                                                {formatPercent(
                                                                    item.lead_cr,
                                                                    2,
                                                                )}
                                                                %
                                                            </Badge>
                                                        </td>
                                                        <td className="p-4">
                                                            <Badge variant="outline">
                                                                {formatPercent(
                                                                    item.strict_cr,
                                                                    2,
                                                                )}
                                                                %
                                                            </Badge>
                                                        </td>
                                                        <td className="p-4">
                                                            <span
                                                                className={`font-bold ${isWinner ? 'text-chart-4' : 'text-foreground'}`}
                                                            >
                                                                {formatCurrency(
                                                                    item.rpv,
                                                                )}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 text-foreground">
                                                            {formatCurrency(
                                                                item.revenue,
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Activity className="h-5 w-5 text-primary" />
                                    <div>
                                        <CardTitle>Split Funnel</CardTitle>
                                        <CardDescription>
                                            Compare conversion journey across
                                            landing pages
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex flex-wrap gap-4">
                                    {filteredFunnel.map((f, index) => (
                                        <div
                                            key={f.landing_source}
                                            className="flex items-center space-x-2"
                                        >
                                            <Checkbox
                                                id={`funnel-${f.landing_source}`}
                                                checked={selectedFunnelSources.includes(
                                                    f.landing_source,
                                                )}
                                                onCheckedChange={() =>
                                                    toggleFunnelSource(
                                                        f.landing_source,
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor={`funnel-${f.landing_source}`}
                                                className="flex cursor-pointer items-center gap-2 text-sm"
                                            >
                                                <div
                                                    className="h-3 w-3 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            CHART_COLORS[
                                                                index %
                                                                    CHART_COLORS.length
                                                            ],
                                                    }}
                                                />
                                                {f.landing_source}
                                            </Label>
                                        </div>
                                    ))}
                                </div>

                                {selectedFunnelSources.length > 0 ? (
                                    <div className="h-[350px] w-full">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <BarChart
                                                data={chartData}
                                                margin={{
                                                    top: 20,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    className="stroke-border"
                                                />
                                                <XAxis
                                                    dataKey="name"
                                                    className="fill-muted-foreground text-xs"
                                                />
                                                <YAxis className="fill-muted-foreground text-xs" />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor:
                                                            'var(--popover)',
                                                        border: '1px solid var(--border)',
                                                        borderRadius: '8px',
                                                        color: 'var(--popover-foreground)',
                                                    }}
                                                />
                                                <Legend />
                                                {selectedFunnelSources.map(
                                                    (source) => (
                                                        <Bar
                                                            key={source}
                                                            dataKey={source}
                                                            fill={
                                                                CHART_COLORS[
                                                                    filteredFunnel.findIndex(
                                                                        (f) =>
                                                                            f.landing_source ===
                                                                            source,
                                                                    ) %
                                                                        CHART_COLORS.length
                                                                ]
                                                            }
                                                            radius={[
                                                                4, 4, 0, 0,
                                                            ]}
                                                        />
                                                    ),
                                                )}
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="py-12 text-center text-muted-foreground">
                                        Select at least one landing page to view
                                        the funnel chart
                                    </div>
                                )}

                                {selectedFunnelSources.length > 0 && (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-border">
                                                    <th className="p-3 text-left font-medium text-muted-foreground">
                                                        Stage
                                                    </th>
                                                    {selectedFunnelSources.map(
                                                        (source) => (
                                                            <th
                                                                key={source}
                                                                className="p-3 text-left font-medium text-muted-foreground"
                                                            >
                                                                {source}
                                                            </th>
                                                        ),
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {FUNNEL_STAGES.map((stage) => (
                                                    <tr
                                                        key={stage}
                                                        className="border-b border-border"
                                                    >
                                                        <td className="p-3 font-medium text-foreground">
                                                            {stage}
                                                        </td>
                                                        {selectedFunnelSources.map(
                                                            (source) => {
                                                                const step =
                                                                    toSafeArray(
                                                                        filteredFunnel.find(
                                                                            (f) =>
                                                                                f.landing_source ===
                                                                                source,
                                                                        )?.steps,
                                                                    ).find(
                                                                        (s) =>
                                                                            s.stage ===
                                                                            stage,
                                                                    );

                                                                return (
                                                                    <td
                                                                        key={source}
                                                                        className="p-3"
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-foreground">
                                                                                {formatNumber(
                                                                                    step?.count ?? 0,
                                                                                )}
                                                                            </span>
                                                                            <span className="text-xs text-muted-foreground">
                                                                                ({formatPercent(
                                                                                    step?.percentage,
                                                                                    1,
                                                                                )}%)
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                );
                                                            },
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {filteredDevices.length > 0 && (
                            <DeviceComparison data={filteredDevices} />
                        )}
                        {filteredCta.length > 0 && (
                            <CtaAnalysis data={filteredCta} />
                        )}
                        {(filteredReaders.length > 0 ||
                            filteredHeatmap.length > 0 ||
                            filteredSectionHeatmap.length > 0) && (
                            <AudienceSegmentation
                                readers={filteredReaders}
                                heatmap={filteredHeatmap}
                                sectionHeatmap={filteredSectionHeatmap}
                            />
                        )}

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Users className="h-5 w-5 text-primary" />
                                <div>
                                    <h2 className="text-xl font-semibold text-foreground">
                                        Behavior Analysis
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Converted vs non-converted engagement
                                        comparison
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {filteredQuality.map((item) => {
                                    const defaultMetrics: QualityMetrics = {
                                        count: 0,
                                        avg_scroll_depth: 0,
                                        avg_dwell_time: 0,
                                    };
                                    const leads = item.leads ?? defaultMetrics;
                                    const nonLeads =
                                        item.non_leads ?? defaultMetrics;

                                    return (
                                        <Card key={item.landing_source}>
                                            <CardHeader className="pb-3">
                                                <CardTitle className="font-mono text-sm">
                                                    {item.landing_source}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-1 text-xs">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-primary">
                                                            Converted (
                                                            {leads.count})
                                                        </span>
                                                        <span className="font-medium text-foreground">
                                                            {formatPercent(
                                                                leads.avg_scroll_depth,
                                                                1,
                                                            )}
                                                            % scroll
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-muted-foreground">
                                                            Others (
                                                            {nonLeads.count})
                                                        </span>
                                                        <span className="text-foreground">
                                                            {formatPercent(
                                                                nonLeads.avg_scroll_depth,
                                                                1,
                                                            )}
                                                            % scroll
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between gap-4 border-t border-border pt-3">
                                                    <div className="text-center">
                                                        <div className="text-lg font-bold text-primary">
                                                            {formatDuration(
                                                                leads.avg_dwell_time,
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            Converted
                                                        </div>
                                                    </div>
                                                    <Target className="h-4 w-4 text-muted-foreground" />
                                                    <div className="text-center">
                                                        <div className="text-lg font-bold text-foreground">
                                                            {formatDuration(
                                                                nonLeads.avg_dwell_time,
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            Others
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}