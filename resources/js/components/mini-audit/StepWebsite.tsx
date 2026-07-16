import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Globe } from 'lucide-react';

interface StepWebsiteProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export default function StepWebsite({
    value,
    onChange,
    error,
}: StepWebsiteProps) {
    return (
        <div className="space-y-4">
            <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-lp-primary/20 bg-lp-primary/10">
                    <Globe className="h-5 w-5 text-lp-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-lp-text">
                        Website Anda
                    </h3>
                    <p className="text-sm text-lp-text-muted">
                        Masukkan link website yang ingin diaudit
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="website" className="text-lp-text">Link Website</Label>
                <div className="relative">
                    <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-lp-text-muted">
                        https://
                    </span>
                    <Input
                        id="website"
                        type="text"
                        placeholder="example.com"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={cn(
                            'h-12 border-lp-border-soft bg-lp-bg-elevated/50 pl-20 text-lp-text placeholder:text-lp-text-muted',
                            error && 'border-lp-danger',
                        )}
                    />
                </div>
                {error && <p className="text-sm text-lp-danger">{error}</p>}
            </div>
        </div>
    );
}
