import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SimpleDateRange {
    from?: string;
    to?: string;
}

interface DateRangePickerProps {
    className?: string;
    date: SimpleDateRange | undefined;
    onUpdate: (date: SimpleDateRange | undefined) => void;
}

/**
 * A shared, dependency-free date range picker: two native date inputs.
 * Used by the Labs "Custom Range" filter.
 */
export function DateRangePicker({
    className,
    date,
    onUpdate,
}: DateRangePickerProps) {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <input
                type="date"
                value={date?.from ?? ''}
                max={date?.to}
                onChange={(e) =>
                    onUpdate({ from: e.target.value, to: date?.to })
                }
                className="h-9 rounded-md border border-input bg-transparent px-2 text-sm text-foreground"
            />
            <span className="text-sm text-muted-foreground">to</span>
            <input
                type="date"
                value={date?.to ?? ''}
                min={date?.from}
                onChange={(e) =>
                    onUpdate({ from: date?.from, to: e.target.value })
                }
                className="h-9 rounded-md border border-input bg-transparent px-2 text-sm text-foreground"
            />
        </div>
    );
}
