import { useMemo } from 'react';
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import type {
    NameType,
    ValueType,
} from 'recharts/types/component/DefaultTooltipContent';
import { cn } from '@/lib/utils';

interface RevenueChartProps {
    data: Record<string, Array<{ date: string; total: number }>>;
    className?: string;
}

export function RevenueChart({ data, className }: RevenueChartProps) {
    const chartData = useMemo(() => {
        const dates = new Set<string>();
        Object.values(data).forEach((eventData) =>
            eventData.forEach((item) => dates.add(item.date)),
        );

        const sortedDates = Array.from(dates).sort();
        const coursePrice = Number(import.meta.env.VITE_COURSE_PRICE ?? 129000);

        return sortedDates.map((date) => {
            const visits =
                data.visit?.find((item) => item.date === date)?.total || 0;
            const engagements =
                data.engagement?.find((item) => item.date === date)?.total || 0;
            const conversions =
                data.conversion?.find((item) => item.date === date)?.total || 0;
            const payments =
                data.payment?.find((item) => item.date === date)?.total || 0;
            const revenue = payments * coursePrice;

            return {
                date: new Date(date).toLocaleDateString('id-ID', {
                    month: 'short',
                    day: 'numeric',
                }),
                visits,
                engagements,
                conversions,
                payments,
                revenue: revenue / 1_000_000,
            };
        });
    }, [data]);

    const formatCurrency = (value: number) =>
        `Rp ${(value * 1_000_000).toLocaleString('id-ID')}`;

    return (
        <div
            className={cn(
                'rounded-xl border border-border/50 bg-card/30 p-6 backdrop-blur-sm',
                'transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10',
                className,
            )}
        >
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                    Revenue Trends
                </h3>
                <p className="text-sm text-muted-foreground">
                    Daily revenue and conversion tracking
                </p>
            </div>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            className="stroke-border"
                            opacity={0.3}
                        />
                        <XAxis
                            dataKey="date"
                            className="fill-muted-foreground text-xs"
                        />
                        <YAxis className="fill-muted-foreground text-xs" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--popover)',
                                border: '1px solid var(--border)',
                                borderRadius: '8px',
                                color: 'var(--popover-foreground)',
                            }}
                            formatter={(
                                value: ValueType | undefined,
                                name: NameType | undefined,
                            ) => {
                                if (name === 'revenue') {
                                    return [
                                        formatCurrency(Number(value ?? 0)),
                                        'Revenue',
                                    ];
                                }

                                const n = String(name ?? '');

                                return [
                                    value,
                                    n.charAt(0).toUpperCase() + n.slice(1),
                                ];
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="visits"
                            stroke="var(--chart-1)"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="engagements"
                            stroke="var(--chart-2)"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="conversions"
                            stroke="var(--chart-3)"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="var(--chart-4)"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
