import { ArrowDown, Eye, Layers, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { formatPercent, safeNumber, toSafeArray } from '@/lib/safe-data';
import type {
    AudienceSegmentationProps,
    DepthAnalysis,
    Persona,
    SectionViewData,
} from '@/types/analytics';

const PERSONA_COLORS: Record<string, string> = {
    Bouncers: 'var(--destructive)',
    Skimmers: 'var(--chart-3)',
    'Deep Readers': 'var(--chart-4)',
    Casuals: 'var(--chart-2)',
};

const DEPTH_COLORS = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
];

type TabType = 'personas' | 'heatmap' | 'sections';

export function AudienceSegmentation({
    readers,
    heatmap,
    sectionHeatmap,
}: AudienceSegmentationProps) {
    const [activeTab, setActiveTab] = useState<TabType>('personas');

    const safeReaders = toSafeArray(readers);
    const safeHeatmap = toSafeArray(heatmap);
    const safeSectionHeatmap = toSafeArray(sectionHeatmap);

    const personaChartData = useMemo(() => {
        return safeReaders.map((r) => {
            const dataPoint: Record<string, string | number> = {
                name: r.landing_source,
            };
            toSafeArray<Persona>(r.personas).forEach((p) => {
                dataPoint[p.name] = safeNumber(p.percentage);
            });

            return dataPoint;
        });
    }, [safeReaders]);

    const heatmapChartData = useMemo(() => {
        const depths = [25, 50, 75, 90];

        return depths.map((depth) => {
            const dataPoint: Record<string, string | number> = {
                name: `${depth}%`,
                depth,
            };
            safeHeatmap.forEach((h) => {
                const analysis = toSafeArray<DepthAnalysis>(
                    h.depth_analysis,
                ).find((d) => d.depth === depth);
                dataPoint[h.landing_source] = safeNumber(analysis?.percentage);
            });

            return dataPoint;
        });
    }, [safeHeatmap]);

    const personaNames = useMemo(() => {
        if (safeReaders.length === 0) {
            return [];
        }

        return toSafeArray<Persona>(safeReaders[0].personas).map((p) => p.name);
    }, [safeReaders]);

    const landingSources = safeHeatmap.map((h) => h.landing_source);
    const hasData =
        safeReaders.length > 0 ||
        safeHeatmap.length > 0 ||
        safeSectionHeatmap.length > 0;

    if (!hasData) {
        return (
            <Card className="py-12 text-center">
                <CardContent>
                    <Users className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                    <p className="text-muted-foreground">
                        No audience segmentation data available
                    </p>
                </CardContent>
            </Card>
        );
    }

    const getDropOffColor = (pct: number) => {
        if (pct >= 80) {
            return 'bg-emerald-500';
        }

        if (pct >= 60) {
            return 'bg-emerald-400';
        }

        if (pct >= 40) {
            return 'bg-amber-400';
        }

        if (pct >= 20) {
            return 'bg-orange-400';
        }

        return 'bg-red-400';
    };

    const getDropBadgeVariant = (
        drop: number,
    ): 'default' | 'destructive' | 'outline' | 'secondary' => {
        if (drop > 30) {
            return 'destructive';
        }

        if (drop > 15) {
            return 'secondary';
        }

        return 'outline';
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                    <h2 className="text-xl font-semibold text-foreground">
                        Audience Segmentation
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        User behavior patterns and content consumption
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setActiveTab('personas')}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                                activeTab === 'personas'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                        >
                            <Users className="h-4 w-4" />
                            Personas
                        </button>
                        <button
                            onClick={() => setActiveTab('heatmap')}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                                activeTab === 'heatmap'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                        >
                            <Eye className="h-4 w-4" />
                            Scroll Heatmap
                        </button>
                        <button
                            onClick={() => setActiveTab('sections')}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                                activeTab === 'sections'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                        >
                            <Layers className="h-4 w-4" />
                            Section Views
                        </button>
                    </div>
                </CardHeader>
                <CardContent>
                    {activeTab === 'personas' && safeReaders.length > 0 && (
                        <div className="space-y-6">
                            <div>
                                <CardTitle className="text-base">
                                    Behavioral Personas
                                </CardTitle>
                                <CardDescription>
                                    Traffic composition by reader type
                                </CardDescription>
                            </div>

                            {/* Legend + Descriptions */}
                            <div className="space-y-3 rounded-lg border border-border/50 bg-muted/20 p-4">
                                <div className="flex flex-wrap gap-4">
                                    {personaNames.map((name) => (
                                        <div key={name} className="flex items-center gap-2">
                                            <div
                                                className="h-3 w-3 rounded-full"
                                                style={{ backgroundColor: PERSONA_COLORS[name] }}
                                            />
                                            <span className="text-sm text-muted-foreground">
                                                {name}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 gap-x-4 gap-y-2 border-t border-border/50 pt-3 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="flex items-center gap-1 font-semibold text-foreground">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--destructive)]" />
                                            Bouncers
                                        </span>
                                        <span>Scroll &lt; 25% &amp; Dwell &lt; 15s, no CTA/checkout/purchase (Immediate exit)</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="flex items-center gap-1 font-semibold text-foreground">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--chart-3)]" />
                                            Skimmers
                                        </span>
                                        <span>Scroll &gt; 75% &amp; Dwell &lt; 60s (Scanning only)</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="flex items-center gap-1 font-semibold text-foreground">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--chart-4)]" />
                                            Deep Readers
                                        </span>
                                        <span>Total Dwell Time &gt; 2 mins (Highly engaged)</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="flex items-center gap-1 font-semibold text-foreground">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--chart-2)]" />
                                            Casuals
                                        </span>
                                        <span>Moderate scroll &amp; dwell time</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stacked Bar Chart */}
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={personaChartData}
                                        layout="vertical"
                                        margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                        <XAxis
                                            type="number"
                                            domain={[0, 100]}
                                            unit="%"
                                            className="fill-muted-foreground text-xs"
                                        />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            className="fill-muted-foreground text-xs"
                                            width={70}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'var(--popover)',
                                                border: '1px solid var(--border)',
                                                borderRadius: '8px',
                                                color: 'var(--popover-foreground)',
                                            }}
                                            formatter={(value) => [`${Number(value ?? 0).toFixed(1)}%`]}
                                        />
                                        {personaNames.map((name) => (
                                            <Bar
                                                key={name}
                                                dataKey={name}
                                                stackId="a"
                                                fill={PERSONA_COLORS[name]}
                                            />
                                        ))}
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Insight Cards */}
                            <div className="grid gap-3 md:grid-cols-2">
                                {safeReaders.map((r) => {
                                    const rPersonas = toSafeArray<Persona>(r.personas);
                                    const bouncers = rPersonas.find((p) => p.name === 'Bouncers');
                                    const deepReaders = rPersonas.find((p) => p.name === 'Deep Readers');
                                    const hasIssue = safeNumber(bouncers?.percentage) > 50;
                                    const hasWin = safeNumber(deepReaders?.percentage) > 20;

                                    return (
                                        <div
                                            key={r.landing_source}
                                            className={`rounded-lg border p-3 ${
                                                hasIssue
                                                    ? 'border-destructive/50 bg-destructive/10'
                                                    : hasWin
                                                      ? 'border-chart-4/50 bg-chart-4/10'
                                                      : 'border-border'
                                            }`}
                                        >
                                            <div className="mb-2 flex items-center justify-between">
                                                <span className="font-mono text-sm font-medium text-foreground">
                                                    {r.landing_source}
                                                </span>
                                                {hasIssue && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        High Bounce
                                                    </Badge>
                                                )}
                                                {hasWin && !hasIssue && (
                                                    <Badge className="bg-chart-4 text-xs text-foreground">
                                                        Engaged
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                {rPersonas.map((p) => (
                                                    <div key={p.name} className="flex justify-between">
                                                        <span className="text-muted-foreground">{p.name}:</span>
                                                        <span className="font-medium text-foreground">
                                                            {formatPercent(p.percentage, 1)}%
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {activeTab === 'heatmap' && safeHeatmap.length > 0 && (
                        <div className="space-y-6">
                            <div>
                                <CardTitle className="text-base">Scroll Depth Heatmap</CardTitle>
                                <CardDescription>Content consumption drop-off visualization</CardDescription>
                            </div>

                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={heatmapChartData}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                        <XAxis dataKey="name" className="fill-muted-foreground text-xs" />
                                        <YAxis
                                            domain={[0, 100]}
                                            unit="%"
                                            className="fill-muted-foreground text-xs"
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'var(--popover)',
                                                border: '1px solid var(--border)',
                                                borderRadius: '8px',
                                                color: 'var(--popover-foreground)',
                                            }}
                                            formatter={(value) => [`${Number(value ?? 0).toFixed(1)}%`]}
                                        />
                                        <Legend />
                                        {landingSources.map((source, index) => (
                                            <Bar
                                                key={source}
                                                dataKey={source}
                                                fill={DEPTH_COLORS[index % DEPTH_COLORS.length]}
                                                radius={[4, 4, 0, 0]}
                                            />
                                        ))}
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Drop-off Analysis */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-foreground">
                                    Drop-off Analysis
                                </h4>
                                {safeHeatmap.map((h) => {
                                    const depths = toSafeArray<DepthAnalysis>(
                                        h.depth_analysis,
                                    ).sort(
                                        (a, b) =>
                                            safeNumber(a.depth) - safeNumber(b.depth),
                                    );
                                    const hasCliff =
                                        depths.length >= 2 &&
                                        safeNumber(depths[0].percentage) -
                                            safeNumber(depths[1].percentage) >
                                            40;

                                    return (
                                        <div
                                            key={h.landing_source}
                                            className={`rounded-lg border p-3 ${hasCliff ? 'border-destructive/50' : 'border-border'}`}
                                        >
                                            <div className="mb-2 flex items-center justify-between">
                                                <span className="font-mono text-sm font-medium text-foreground">
                                                    {h.landing_source}
                                                </span>
                                                {hasCliff && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        Drop-off Cliff
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {depths.map((d) => (
                                                    <div key={d.depth} className="flex-1">
                                                        <div className="mb-1 text-center text-xs">
                                                            <span className="text-muted-foreground">
                                                                {d.depth}%
                                                            </span>
                                                        </div>
                                                        <div className="h-8 w-full overflow-hidden rounded bg-muted">
                                                            <div
                                                                className="h-full bg-primary transition-all"
                                                                style={{
                                                                    height: `${safeNumber(d.percentage)}%`,
                                                                    opacity:
                                                                        0.4 +
                                                                        (safeNumber(d.percentage) / 100) * 0.6,
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="mt-1 text-center text-xs font-medium">
                                                            {formatPercent(d.percentage, 0)}%
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {activeTab === 'sections' && safeSectionHeatmap.length > 0 && (
                        <div className="space-y-6">
                            <div>
                                <CardTitle className="text-base">Section Visibility Funnel</CardTitle>
                                <CardDescription>
                                    Percentage of visitors who saw each section — identify where users drop off
                                </CardDescription>
                            </div>

                            {safeSectionHeatmap.map((item) => {
                                const sections = toSafeArray<SectionViewData>(item.sections);

                                if (sections.length === 0) {
                                    return null;
                                }

                                const maxViews = sections[0]?.views ?? 1;
                                const biggestDrop = sections.reduce(
                                    (max, s) => (s.drop_from_prev > max.drop_from_prev ? s : max),
                                    sections[0],
                                );

                                return (
                                    <div key={item.landing_source} className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-sm font-semibold text-foreground">
                                                {item.landing_source}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {maxViews.toLocaleString()} total sessions
                                            </span>
                                        </div>

                                        <div className="space-y-1">
                                            {sections.map((section, idx) => (
                                                <div key={section.id}>
                                                    {idx > 0 && section.drop_from_prev > 0 && (
                                                        <div className="flex items-center justify-center py-1">
                                                            <div className="flex items-center gap-1.5">
                                                                <ArrowDown className="h-3 w-3 text-muted-foreground" />
                                                                <Badge
                                                                    variant={getDropBadgeVariant(section.drop_from_prev)}
                                                                    className="px-2 py-0 text-[10px]"
                                                                >
                                                                    −{formatPercent(section.drop_from_prev, 1)}%
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="group relative">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-28 shrink-0 text-right">
                                                                <span
                                                                    className={`text-xs font-medium ${
                                                                        section.id === biggestDrop?.id &&
                                                                        biggestDrop.drop_from_prev > 15
                                                                            ? 'text-destructive'
                                                                            : 'text-foreground'
                                                                    }`}
                                                                >
                                                                    {section.name}
                                                                </span>
                                                            </div>

                                                            <div className="relative h-8 flex-1 overflow-hidden rounded-md bg-muted">
                                                                <div
                                                                    className={`h-full rounded-md transition-all duration-500 ${getDropOffColor(section.pct)}`}
                                                                    style={{ width: `${Math.max(section.pct, 2)}%` }}
                                                                />
                                                                <div className="absolute inset-0 flex items-center px-3">
                                                                    <span
                                                                        className={`text-xs font-bold ${
                                                                            section.pct > 30 ? 'text-white' : 'text-foreground'
                                                                        }`}
                                                                    >
                                                                        {formatPercent(section.pct, 1)}%
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="w-16 shrink-0 text-right">
                                                                <span className="text-xs text-muted-foreground">
                                                                    {section.views.toLocaleString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {biggestDrop && biggestDrop.drop_from_prev > 15 && (
                                            <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs">
                                                <ArrowDown className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
                                                <div>
                                                    <span className="font-medium text-foreground">
                                                        Biggest drop: {biggestDrop.name}
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                        {' '}— {formatPercent(biggestDrop.drop_from_prev, 1)}% of visitors
                                                        didn&apos;t reach this section from the previous one.
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {activeTab === 'personas' && safeReaders.length === 0 && (
                        <p className="py-8 text-center text-muted-foreground">No persona data available</p>
                    )}
                    {activeTab === 'heatmap' && safeHeatmap.length === 0 && (
                        <p className="py-8 text-center text-muted-foreground">No heatmap data available</p>
                    )}
                    {activeTab === 'sections' && safeSectionHeatmap.length === 0 && (
                        <p className="py-8 text-center text-muted-foreground">
                            No section view data available yet. Data will appear after visitors scroll through
                            landing page sections.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}