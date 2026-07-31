import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FunnelStage } from '@/types/analytics';

interface ConversionFunnelProps {
    data: FunnelStage[];
    className?: string;
}

// Bar gradient per stage index — shifts from sky-blue (Visits) to rose (Payments)
const STAGE_GRADIENTS = [
    'from-sky-500 to-sky-400',
    'from-violet-500 to-violet-400',
    'from-purple-500 to-purple-400',
    'from-fuchsia-500 to-fuchsia-400',
    'from-pink-500 to-pink-400',
    'from-rose-500 to-rose-400',
];

function getTransitionStyle(pct: number) {
    if (pct >= 70)
        return {
            pill: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
            line: 'bg-emerald-500',
        };
    if (pct >= 40)
        return {
            pill: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
            line: 'bg-amber-500',
        };
    return {
        pill: 'border-destructive/40 bg-destructive/10 text-destructive',
        line: 'bg-destructive',
    };
}

export function ConversionFunnel({ data, className }: ConversionFunnelProps) {
    if (!data || data.length === 0) return null;

    return (
        <div
            className={cn(
                'rounded-xl border border-border/50 bg-card/30 p-6 backdrop-blur-sm',
                'transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10',
                className,
            )}
        >
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">
                    Conversion Funnel
                </h3>
                <p className="text-sm text-muted-foreground">
                    Stage-by-stage retention — how many users advance from each step
                </p>
            </div>

            {/* Funnel stages */}
            <div className="space-y-0">
                {data.map((stage, index) => {
                    const gradient =
                        STAGE_GRADIENTS[index] ??
                        STAGE_GRADIENTS[STAGE_GRADIENTS.length - 1];
                    const barWidth = Math.max(stage.percentage, 2);

                    return (
                        <div key={stage.stage}>
                            {/* Transition connector — shown between every pair of stages */}
                            {stage.transition_pct !== null &&
                                stage.from_stage !== null && (() => {
                                    const s = getTransitionStyle(stage.transition_pct);
                                    return (
                                        <div className="flex items-center justify-center py-3">
                                            <div className="flex flex-col items-center gap-1">
                                                <div className={cn('h-3 w-px opacity-40', s.line)} />
                                                <div
                                                    className={cn(
                                                        'flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-semibold',
                                                        s.pill,
                                                    )}
                                                >
                                                    <ArrowDown className="h-3 w-3" />
                                                    {stage.transition_pct}% of {stage.from_stage} continued
                                                </div>
                                                <div className={cn('h-3 w-px opacity-40', s.line)} />
                                            </div>
                                        </div>
                                    );
                                })()}

                            {/* Stage row */}
                            <div className="group relative">
                                {/* Labels */}
                                <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={cn(
                                                'inline-block h-2.5 w-2.5 rounded-full bg-gradient-to-br',
                                                gradient,
                                            )}
                                        />
                                        <span className="text-sm font-semibold text-foreground">
                                            {stage.stage}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-sm text-muted-foreground">
                                            {stage.count.toLocaleString('id-ID')}
                                        </span>
                                        <span
                                            className={cn(
                                                'rounded-full px-2.5 py-0.5 text-xs font-bold',
                                                index === 0
                                                    ? 'bg-sky-500/20 text-sky-400'
                                                    : 'bg-muted/60 text-muted-foreground',
                                            )}
                                        >
                                            {stage.percentage}%
                                        </span>
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <div className="h-7 overflow-hidden rounded-lg bg-muted/20">
                                    <div
                                        className={cn(
                                            'h-full rounded-lg bg-gradient-to-r opacity-80 transition-all duration-1000 ease-out group-hover:opacity-100',
                                            gradient,
                                        )}
                                        style={{ width: `${barWidth}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-border/30 pt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                    ≥ 70% retained
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
                    40–69% retained
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="inline-block h-2 w-2 rounded-full bg-destructive" />
                    &lt; 40% retained
                </div>
                <span className="ml-auto hidden sm:block">Bar width = % of total visits</span>
            </div>
        </div>
    );
}
