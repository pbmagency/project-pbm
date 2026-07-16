import { cn } from '@/lib/utils';
import { User, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface StepIdentityProps {
    nama: string;
    email: string;
    onNamaChange: (value: string) => void;
    onEmailChange: (value: string) => void;
    errors: { nama?: string; email?: string };
}

export default function StepIdentity({ nama, email, onNamaChange, onEmailChange, errors }: StepIdentityProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lp-primary/10 border border-lp-primary/20">
                    <User className="h-5 w-5 text-lp-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-lp-text">Siapa Anda?</h3>
                    <p className="text-sm text-lp-text-muted">Kami perlu tahu siapa yang meminta audit</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="nama" className="text-lp-text">Nama Lengkap</Label>
                    <Input
                        id="nama"
                        type="text"
                        placeholder="John Doe"
                        value={nama}
                        onChange={(e) => onNamaChange(e.target.value)}
                        className={cn(
                            'h-12 bg-lp-bg-elevated/50 border-lp-border-soft text-lp-text placeholder:text-lp-text-muted',
                            errors.nama && 'border-lp-danger'
                        )}
                    />
                    {errors.nama && <p className="text-sm text-lp-danger">{errors.nama}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-lp-text">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-lp-text-muted" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => onEmailChange(e.target.value)}
                            className={cn(
                                'h-12 pl-10 bg-lp-bg-elevated/50 border-lp-border-soft text-lp-text placeholder:text-lp-text-muted',
                                errors.email && 'border-lp-danger'
                            )}
                        />
                    </div>
                    {errors.email && <p className="text-sm text-lp-danger">{errors.email}</p>}
                </div>
            </div>
        </div>
    );
}
