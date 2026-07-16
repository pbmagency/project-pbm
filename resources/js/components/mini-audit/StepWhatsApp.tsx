import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const COUNTRY_CODES = [
    { code: '+62', country: '🇮🇩 Indonesia' },
    { code: '+60', country: '🇲🇾 Malaysia' },
    { code: '+65', country: '🇸🇬 Singapore' },
    { code: '+1', country: '🇺🇸 USA' },
    { code: '+44', country: '🇬🇧 UK' },
    { code: '+61', country: '🇦🇺 Australia' },
    { code: '+81', country: '🇯🇵 Japan' },
    { code: '+82', country: '🇰🇷 Korea' },
];

interface StepWhatsAppProps {
    value: string;
    countryCode: string;
    onChange: (value: string) => void;
    onCountryCodeChange: (code: string) => void;
    error?: string;
}

export default function StepWhatsApp({ value, countryCode, onChange, onCountryCodeChange, error }: StepWhatsAppProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lp-primary/10 border border-lp-primary/20">
                    <Phone className="h-5 w-5 text-lp-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-lp-text">Nomor WhatsApp</h3>
                    <p className="text-sm text-lp-text-muted">Untuk mengirim hasil audit secara personal</p>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-lp-text">Nomor WhatsApp</Label>
                <div className="flex gap-2">
                    <select
                        value={countryCode}
                        onChange={(e) => onCountryCodeChange(e.target.value)}
                        className="h-12 rounded-md border border-lp-border-soft bg-lp-bg-elevated/50 px-3 text-sm text-lp-text focus:border-lp-primary focus:ring-lp-primary/30 focus:ring-[3px] outline-none"
                    >
                        {COUNTRY_CODES.map((c) => (
                            <option key={c.code} value={c.code} className="bg-lp-bg-elevated text-lp-text">
                                {c.country} ({c.code})
                            </option>
                        ))}
                    </select>
                    <Input
                        id="whatsapp"
                        type="tel"
                        placeholder="81234567890"
                        value={value}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            onChange(val);
                        }}
                        className={cn(
                            'h-12 flex-1 bg-lp-bg-elevated/50 border-lp-border-soft text-lp-text placeholder:text-lp-text-muted',
                            error && 'border-lp-danger'
                        )}
                    />
                </div>
                {error && <p className="text-sm text-lp-danger">{error}</p>}
            </div>
        </div>
    );
}
