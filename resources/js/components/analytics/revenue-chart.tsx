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
import { cn } from '@/lib/utils';

interface RevenueChartProps {
    data: Record<string, any[]>;
    className?: string;
}

export function RevenueChart({ data, className }: RevenueChartProps) {
    const chartData = useMemo(() => {
        const dates = new Set<string>();

        // Collect all dates
        Object.values(data).forEach((eventData) => {
            eventData.forEach((item) => dates.add(item.date));
        });

        // Sort dates
        const sortedDates = Array.from(dates).sort();

        // Create chart data
        return sortedDates.map((date) => {
            const visits =
                data.visit?.find((item) => item.date === date)?.total || 0;
            const engagements =
                data.engagement?.find((item) => item.date === date)?.total || 0;
            const intent =
                data.cta_click?.find((item) => item.date === date)?.total || 0;
            const directCheckouts =
                data.direct_checkout?.find((item) => item.date === date)
                    ?.total || 0;
            const whatsAppLeads =
                data.whatsapp_lead?.find((item) => item.date === date)?.total ||
                0;
            const totalLeads =
                data.total_lead?.find((item) => item.date === date)?.total || 0;

            return {
                date: new Date(date).toLocaleDateString('id-ID', {
                    month: 'short',
                    day: 'numeric',
                }),
                visits,
                engagements,
                intent,
                directCheckouts,
                whatsAppLeads,
                totalLeads,
            };
        });
    }, [data]);

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
                    Funnel Trends
                </h3>
                <p className="text-sm text-muted-foreground">
                    Daily tracked sessions by funnel event
                </p>
            </div>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="oklch(0.15 0 0)"
                            opacity={0.3}
                        />
                        <XAxis
                            dataKey="date"
                            stroke="oklch(0.65 0 0)"
                            fontSize={12}
                        />
                        <YAxis stroke="oklch(0.65 0 0)" fontSize={12} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'oklch(0.08 0 0)',
                                border: '1px solid oklch(0.15 0 0)',
                                borderRadius: '8px',
                                color: 'oklch(0.98 0 0)',
                            }}
                            formatter={(value, name) => {
                                const label = String(name ?? '');

                                return [
                                    Number(value ?? 0),
                                    label.charAt(0).toUpperCase() +
                                        label.slice(1),
                                ];
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="visits"
                            stroke="oklch(0.75 0.15 85)"
                            strokeWidth={2}
                            dot={{
                                fill: 'oklch(0.75 0.15 85)',
                                strokeWidth: 2,
                                r: 4,
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="engagements"
                            stroke="oklch(0.75 0.15 85)"
                            strokeWidth={2}
                            dot={{
                                fill: 'oklch(0.75 0.15 85)',
                                strokeWidth: 2,
                                r: 4,
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="intent"
                            stroke="oklch(0.6 0.12 184)"
                            strokeWidth={2}
                            dot={{
                                fill: 'oklch(0.6 0.12 184)',
                                strokeWidth: 2,
                                r: 4,
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="directCheckouts"
                            name="Direct Checkout"
                            stroke="oklch(0.77 0.19 70)"
                            strokeWidth={2}
                            dot={{
                                fill: 'oklch(0.77 0.19 70)',
                                strokeWidth: 2,
                                r: 4,
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="whatsAppLeads"
                            name="WhatsApp Leads"
                            stroke="oklch(0.65 0.18 145)"
                            strokeWidth={2}
                            dot={{
                                fill: 'oklch(0.65 0.18 145)',
                                strokeWidth: 2,
                                r: 4,
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="totalLeads"
                            name="Total Leads"
                            stroke="oklch(0.65 0.2 300)"
                            strokeWidth={2}
                            dot={{
                                fill: 'oklch(0.65 0.2 300)',
                                strokeWidth: 2,
                                r: 4,
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
