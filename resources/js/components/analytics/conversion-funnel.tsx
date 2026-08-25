import { cn } from '@/lib/utils';

interface FunnelStage {
    stage: string;
    count: number;
    percentage: number;
    transition_percentage?: number;
    from_stage?: string | null;
    branch?: 'main' | 'checkout' | 'lead' | 'total';
}

interface ConversionFunnelProps {
    data: FunnelStage[];
    className?: string;
}

interface StageBarProps {
    stage: FunnelStage;
    maxCount: number;
    accent?: 'default' | 'checkout' | 'lead' | 'total';
}

function StageBar({ stage, maxCount, accent = 'default' }: StageBarProps) {
    const width =
        stage.count > 0 ? Math.max(2, (stage.count / maxCount) * 100) : 0;

    return (
        <div>
            <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-foreground">
                    {stage.stage}
                </span>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        {stage.count.toLocaleString()}
                    </span>
                    <span className="rounded-full bg-muted/30 px-2 py-1 text-xs font-bold text-muted-foreground">
                        {stage.percentage}%
                    </span>
                </div>
            </div>

            {stage.from_stage && (
                <p className="mb-2 text-xs text-muted-foreground">
                    {stage.transition_percentage}% from {stage.from_stage}
                </p>
            )}

            <div className="h-8 overflow-hidden rounded-lg bg-muted/20">
                <div
                    className={cn(
                        'h-full rounded-lg transition-all duration-1000 ease-out',
                        accent === 'default' &&
                            'bg-gradient-to-r from-primary/60 via-primary to-primary/80',
                        accent === 'checkout' &&
                            'bg-gradient-to-r from-blue-500/60 via-blue-500 to-blue-400',
                        accent === 'lead' &&
                            'bg-gradient-to-r from-emerald-500/60 via-emerald-500 to-emerald-400',
                        accent === 'total' &&
                            'bg-gradient-to-r from-violet-500/60 via-violet-500 to-fuchsia-400',
                    )}
                    style={{ width: `${width}%` }}
                />
            </div>
        </div>
    );
}

export function ConversionFunnel({ data, className }: ConversionFunnelProps) {
    const maxCount = Math.max(1, ...data.map((item) => item.count));
    const mainStages = data.filter(
        (stage) => !stage.branch || stage.branch === 'main',
    );
    const checkoutStages = data.filter((stage) => stage.branch === 'checkout');
    const leadStages = data.filter((stage) => stage.branch === 'lead');
    const totalStages = data.filter((stage) => stage.branch === 'total');

    return (
        <div
            className={cn(
                'rounded-xl border border-border/50 bg-card/30 p-6 backdrop-blur-sm',
                'transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10',
                className,
            )}
        >
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">
                    Conversion Journey
                </h3>
                <p className="text-sm text-muted-foreground">
                    Direct Checkout and WhatsApp are independent lead branches
                    after CTA intent
                </p>
            </div>

            <div className="space-y-4">
                {mainStages.map((stage, index) => (
                    <div key={stage.stage}>
                        <StageBar stage={stage} maxCount={maxCount} />
                        {index < mainStages.length - 1 && (
                            <div className="mt-2 flex justify-center">
                                <div className="h-6 w-px bg-border/50" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
                <div className="h-px flex-1 bg-border/50" />
                <span>Intent branches</span>
                <div className="h-px flex-1 bg-border/50" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                    <div>
                        <h4 className="font-semibold text-blue-400">
                            Direct Checkout
                        </h4>
                        <p className="text-xs text-muted-foreground">
                            Redirects directly to an external checkout page.
                        </p>
                    </div>
                    {checkoutStages.map((stage) => (
                        <StageBar
                            key={stage.stage}
                            stage={stage}
                            maxCount={maxCount}
                            accent="checkout"
                        />
                    ))}
                </div>

                <div className="space-y-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <div>
                        <h4 className="font-semibold text-emerald-400">
                            WhatsApp Leads
                        </h4>
                        <p className="text-xs text-muted-foreground">
                            Leads from pricing, floating, and other WhatsApp
                            CTAs.
                        </p>
                    </div>
                    {leadStages.map((stage) => (
                        <StageBar
                            key={stage.stage}
                            stage={stage}
                            maxCount={maxCount}
                            accent="lead"
                        />
                    ))}
                </div>
            </div>

            <div className="mt-4 space-y-4 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                <div>
                    <h4 className="font-semibold text-violet-400">
                        Total Leads
                    </h4>
                    <p className="text-xs text-muted-foreground">
                        Direct Checkout + WhatsApp leads.
                    </p>
                </div>
                {totalStages.map((stage) => (
                    <StageBar
                        key={stage.stage}
                        stage={stage}
                        maxCount={maxCount}
                        accent="total"
                    />
                ))}
            </div>
        </div>
    );
}
