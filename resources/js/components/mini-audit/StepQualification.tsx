import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { BarChart3 } from 'lucide-react';

const TRAFFIC_OPTIONS = [
    {
        value: '<1rb',
        label: '< 1.000 pengunjung',
        desc: 'Low Volume',
    },
    {
        value: '1rb-5rb',
        label: '1.000 - 5.000 pengunjung',
        desc: 'Pemula',
    },
    {
        value: '5rb-10rb',
        label: '5.000 - 10.000 pengunjung',
        desc: 'Berkembang',
    },
    {
        value: '10rb-25rb',
        label: '10.000 - 25.000 pengunjung',
        desc: 'Menengah',
    },
    {
        value: '25rb-50rb',
        label: '25.000 - 50.000 pengunjung',
        desc: 'High Volume',
    },
    {
        value: '>50rb',
        label: '> 50.000 pengunjung',
        desc: 'Very High',
    },
];

const OMZET_OPTIONS = [
    { value: '<5jt', label: '< Rp 5 Juta/bulan' },
    { value: '5-10jt', label: 'Rp 5 - 10 Juta/bulan' },
    { value: '10-25jt', label: 'Rp 10 - 25 Juta/bulan' },
    { value: '25-50jt', label: 'Rp 25 - 50 Juta/bulan' },
    { value: '50-100jt', label: 'Rp 50 - 100 Juta/bulan' },
    { value: '>100jt', label: '> Rp 100 Juta/bulan' },
];

const BUDGET_IKLAN_OPTIONS = [
    { value: '<1jt', label: '< Rp 1 Juta/bulan' },
    { value: '1-5jt', label: 'Rp 1 - 5 Juta/bulan' },
    { value: '5-10jt', label: 'Rp 5 - 10 Juta/bulan' },
    { value: '10-15jt', label: 'Rp 10 - 15 Juta/bulan' },
    { value: '15-30jt', label: 'Rp 15 - 30 Juta/bulan' },
    { value: '30-50jt', label: 'Rp 30 - 50 Juta/bulan' },
    { value: '50-100jt', label: 'Rp 50 - 100 Juta/bulan' },
    { value: '>100jt', label: '> Rp 100 Juta/bulan' },
];

const TANTANGAN_OPTIONS = [
    { value: 'traffic-sepi', label: 'Traffic sepi' },
    {
        value: 'konversi-rendah',
        label: 'Traffic banyak tapi yang beli sedikit (Konversi rendah)',
    },
    {
        value: 'chat-banyak',
        label: 'Chat whatsapp banyak, sedikit yang closing.',
    },
    { value: 'loading-lambat', label: 'Loading lambat' },
    { value: 'tampilan-kurang', label: 'Tampilan website kurang meyakinkan' },
    { value: 'buta-data', label: 'Saya tidak tahu (Buta data)' },
    { value: 'lainnya', label: 'Lainnya' },
];

interface StepQualificationProps {
    traffic: string;
    omzet: string;
    budgetIklan: string;
    tantangan: string;
    tantanganLainnya: string;
    onTrafficChange: (v: string) => void;
    onOmzetChange: (v: string) => void;
    onBudgetIklanChange: (v: string) => void;
    onTantanganChange: (v: string) => void;
    onTantanganLainnyaChange: (v: string) => void;
    errors: {
        traffic?: string;
        omzet?: string;
        budget_iklan?: string;
        tantangan?: string;
        tantangan_lainnya?: string;
    };
}

export default function StepQualification({
    traffic,
    omzet,
    budgetIklan,
    tantangan,
    tantanganLainnya,
    onTrafficChange,
    onOmzetChange,
    onBudgetIklanChange,
    onTantanganChange,
    onTantanganLainnyaChange,
    errors,
}: StepQualificationProps) {
    return (
        <div className="space-y-6">
            <div className="mb-2 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-lp-primary/20 bg-lp-primary/10">
                    <BarChart3 className="h-5 w-5 text-lp-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-lp-text">
                        Kualifikasi Bisnis
                    </h3>
                    <p className="text-sm text-lp-text-muted">
                        Bantu kami memahami kondisi bisnis Anda
                    </p>
                </div>
            </div>

            {/* Traffic */}
            <div className="space-y-2">
                <Label className="text-sm font-medium text-lp-text">
                    Rata-rata pengunjung website per bulan?
                </Label>
                <Select value={traffic} onValueChange={onTrafficChange}>
                    <SelectTrigger className="h-11 border-lp-border-soft bg-lp-bg-elevated/50 text-lp-text">
                        <SelectValue placeholder="Pilih rentang traffic..." />
                    </SelectTrigger>
                    <SelectContent>
                        {TRAFFIC_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.traffic && (
                    <p className="text-sm text-lp-danger">{errors.traffic}</p>
                )}
            </div>

            {/* Omzet */}
            <div className="space-y-2">
                <Label className="text-sm font-medium text-lp-text">
                    Omzet bisnis per bulan?
                </Label>
                <Select value={omzet} onValueChange={onOmzetChange}>
                    <SelectTrigger className="h-11 border-lp-border-soft bg-lp-bg-elevated/50 text-lp-text">
                        <SelectValue placeholder="Pilih rentang omzet..." />
                    </SelectTrigger>
                    <SelectContent>
                        {OMZET_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.omzet && (
                    <p className="text-sm text-lp-danger">{errors.omzet}</p>
                )}
            </div>

            {/* Budget Iklan */}
            <div className="space-y-2">
                <Label className="text-sm font-medium text-lp-text">
                    Budget iklan per bulan?
                </Label>
                <Select value={budgetIklan} onValueChange={onBudgetIklanChange}>
                    <SelectTrigger className="h-11 border-lp-border-soft bg-lp-bg-elevated/50 text-lp-text">
                        <SelectValue placeholder="Pilih rentang budget iklan..." />
                    </SelectTrigger>
                    <SelectContent>
                        {BUDGET_IKLAN_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.budget_iklan && (
                    <p className="text-sm text-lp-danger">
                        {errors.budget_iklan}
                    </p>
                )}
            </div>

            {/* Tantangan */}
            <div className="space-y-2">
                <Label className="text-sm font-medium text-lp-text">
                    Tantangan terbesar website Anda saat ini?
                </Label>
                <Select value={tantangan} onValueChange={onTantanganChange}>
                    <SelectTrigger className="h-11 border-lp-border-soft bg-lp-bg-elevated/50 text-lp-text">
                        <SelectValue placeholder="Pilih tantangan utama..." />
                    </SelectTrigger>
                    <SelectContent>
                        {TANTANGAN_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {tantangan === 'lainnya' && (
                    <Input
                        placeholder="Jelaskan tantangan Anda..."
                        value={tantanganLainnya}
                        onChange={(e) =>
                            onTantanganLainnyaChange(e.target.value)
                        }
                        className={cn(
                            'mt-2 h-11 border-lp-border-soft bg-lp-bg-elevated/50 text-lp-text placeholder:text-lp-text-muted',
                            errors.tantangan_lainnya && 'border-lp-danger',
                        )}
                    />
                )}
                {(errors.tantangan || errors.tantangan_lainnya) && (
                    <p className="text-sm text-lp-danger">
                        {errors.tantangan || errors.tantangan_lainnya}
                    </p>
                )}
            </div>
        </div>
    );
}
