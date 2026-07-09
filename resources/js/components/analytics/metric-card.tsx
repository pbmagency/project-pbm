import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    className?: string;
    description?: string;
}

export function MetricCard({
    title,
    value,
    icon: Icon,
    className,
    description,
}: MetricCardProps) {
    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-xl border border-border/50 bg-card/30 p-6 backdrop-blur-sm',
                'transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10',
                className,
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10 transition-colors group-hover:bg-primary/20">
                        <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                        {title}
                    </span>
                </div>

                <div className="space-y-1">
                    <div className="text-2xl font-bold text-foreground transition-colors group-hover:text-primary">
                        {value}
                    </div>
                    {description && (
                        <div className="text-xs text-muted-foreground">
                            {description}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
