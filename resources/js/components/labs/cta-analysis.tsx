import { MousePointerClick, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { formatPercent, toSafeArray } from '@/lib/safe-data';
import type { CtaAnalysisProps, CtaLocation } from '@/types/analytics';

export function CtaAnalysis({ data }: CtaAnalysisProps) {
    const safeData = toSafeArray(data);

    // Sort landing pages and CTA locations by Total Leads.
    const sortedData = useMemo(() => {
        return [...safeData]
            .map((lp) => {
                const locations = toSafeArray<CtaLocation>(lp.cta_locations);

                return {
                    ...lp,
                    cta_locations: [...locations].sort(
                        (a, b) => (b.total_leads ?? 0) - (a.total_leads ?? 0),
                    ),
                    total_leads: locations.reduce(
                        (sum, cta) => sum + (cta.total_leads ?? 0),
                        0,
                    ),
                    total_clicks: locations.reduce(
                        (sum, cta) => sum + (cta.click_count ?? 0),
                        0,
                    ),
                };
            })
            .sort((a, b) => b.total_leads - a.total_leads);
    }, [safeData]);

    if (safeData.length === 0) {
        return (
            <Card className="py-12 text-center">
                <CardContent>
                    <MousePointerClick className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                    <p className="text-muted-foreground">
                        No CTA performance data available
                    </p>
                </CardContent>
            </Card>
        );
    }

    const formatLocation = (location: string) => {
        return location
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <MousePointerClick className="h-5 w-5 text-primary" />
                <div>
                    <h2 className="text-xl font-semibold text-foreground">
                        CTA Performance
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Button placement attribution sorted by Total Leads
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">
                        Micro-Conversion Attribution
                    </CardTitle>
                    <CardDescription>
                        Which button placements generate the most Total Leads?
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Desktop Table */}
                    <div className="hidden overflow-x-auto lg:block">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="p-4 text-left font-medium text-muted-foreground">
                                        Landing Page
                                    </th>
                                    <th className="p-4 text-left font-medium text-muted-foreground">
                                        Button Location
                                    </th>
                                    <th className="p-4 text-right font-medium text-muted-foreground">
                                        Clicks
                                    </th>
                                    <th className="p-4 text-right font-medium text-muted-foreground">
                                        Total Leads
                                    </th>
                                    <th className="p-4 text-right font-medium text-muted-foreground">
                                        Total Lead Rate
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedData.map((lp) =>
                                    lp.cta_locations.map((cta, ctaIndex) => {
                                        const isTopCta =
                                            ctaIndex === 0 &&
                                            (cta.total_leads ?? 0) > 0;
                                        const showLpName = ctaIndex === 0;

                                        return (
                                            <tr
                                                key={`${lp.landing_source}-${cta.location}`}
                                                className="border-b border-border transition hover:bg-muted/50"
                                            >
                                                <td className="p-4">
                                                    {showLpName ? (
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono font-medium text-foreground">
                                                                {
                                                                    lp.landing_source
                                                                }
                                                            </span>
                                                            <Badge
                                                                variant="secondary"
                                                                className="text-xs"
                                                            >
                                                                {
                                                                    lp
                                                                        .cta_locations
                                                                        .length
                                                                }{' '}
                                                                CTAs
                                                            </Badge>
                                                        </div>
                                                    ) : (
                                                        <span className="text-muted-foreground">
                                                            ↳
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={
                                                                isTopCta
                                                                    ? 'font-semibold text-primary'
                                                                    : 'text-foreground'
                                                            }
                                                        >
                                                            {formatLocation(
                                                                cta.location,
                                                            )}
                                                        </span>
                                                        {isTopCta && (
                                                            <Badge
                                                                variant="default"
                                                                className="gap-1 bg-chart-4 text-xs text-foreground"
                                                            >
                                                                <TrendingUp className="h-3 w-3" />{' '}
                                                                Top
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right text-foreground">
                                                    {(
                                                        cta.click_count ?? 0
                                                    ).toLocaleString()}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <span
                                                        className={
                                                            isTopCta
                                                                ? 'font-bold text-chart-4'
                                                                : 'text-foreground'
                                                        }
                                                    >
                                                        {(
                                                            cta.total_leads ?? 0
                                                        ).toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <Badge
                                                        variant={
                                                            (cta.total_lead_rate ??
                                                                0) > 5
                                                                ? 'default'
                                                                : 'outline'
                                                        }
                                                    >
                                                        {formatPercent(
                                                            cta.total_lead_rate,
                                                            2,
                                                        )}
                                                        %
                                                    </Badge>
                                                </td>
                                            </tr>
                                        );
                                    }),
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="space-y-4 lg:hidden">
                        {sortedData.map((lp) => (
                            <div key={lp.landing_source} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono font-medium text-foreground">
                                        {lp.landing_source}
                                    </span>
                                    <Badge
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        {lp.total_leads} total leads
                                    </Badge>
                                </div>
                                <div className="space-y-2 rounded-lg bg-muted/50 p-3">
                                    {lp.cta_locations.map((cta, index) => {
                                        const isTop =
                                            index === 0 &&
                                            (cta.total_leads ?? 0) > 0;

                                        return (
                                            <div
                                                key={cta.location}
                                                className={`flex items-center justify-between rounded-md p-2 ${isTop ? 'bg-chart-4/20' : ''}`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {isTop && (
                                                        <TrendingUp className="h-3 w-3 text-chart-4" />
                                                    )}
                                                    <span
                                                        className={
                                                            isTop
                                                                ? 'font-medium text-foreground'
                                                                : 'text-sm text-muted-foreground'
                                                        }
                                                    >
                                                        {formatLocation(
                                                            cta.location,
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs">
                                                    <span className="text-muted-foreground">
                                                        {cta.click_count ?? 0}{' '}
                                                        clicks
                                                    </span>
                                                    <span
                                                        className={
                                                            isTop
                                                                ? 'font-bold text-chart-4'
                                                                : 'text-foreground'
                                                        }
                                                    >
                                                        {cta.total_leads ?? 0}{' '}
                                                        total leads
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
