import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import type { ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { cn } from '@/lib/utils';

interface ReferralData {
    referral_source: string;
    count: number;
}

interface ReferralChartProps {
    data: ReferralData[];
    className?: string;
}

const COLORS = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
];

export function ReferralChart({ data, className }: ReferralChartProps) {
    const chartData = data.map((item, index) => ({
        name:
            item.referral_source === 'direct' ? 'Direct' : item.referral_source,
        value: item.count,
        color: COLORS[index % COLORS.length],
    }));

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
                    Traffic Sources
                </h3>
                <p className="text-sm text-muted-foreground">
                    Top referral sources breakdown
                </p>
            </div>

            <div className="h-64">
                {chartData.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        No data yet
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                dataKey="value"
                                stroke="var(--card)"
                                strokeWidth={2}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--popover)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '8px',
                                    color: 'var(--popover-foreground)',
                                }}
                                formatter={(value: ValueType | undefined) => [
                                    Number(value ?? 0).toLocaleString(),
                                    'Visits',
                                ]}
                            />
                            <Legend
                                wrapperStyle={{
                                    fontSize: '12px',
                                    color: 'var(--muted-foreground)',
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
