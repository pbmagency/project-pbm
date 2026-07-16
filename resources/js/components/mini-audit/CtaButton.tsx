import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface CtaButtonProps {
    className?: string;
}

const AVATAR_COLORS = [
    'bg-primary/80',
    'bg-accent/80',
    'bg-destructive/60',
    'bg-green-600/80',
    'bg-yellow-600/80',
];

const AVATAR_INITIALS = ['A', 'R', 'S', 'D', 'M'];

export default function CtaButton({ className }: CtaButtonProps) {
    const handleClick = () => {
        const formSection = document.querySelector('.glass');
        if (formSection) {
            formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className={cn('flex flex-col items-center gap-3', className)}>
            <Button
                type="button"
                onClick={handleClick}
                className="glow-sm bg-primary px-8 py-3 text-base font-semibold hover:bg-primary/90"
                size="lg"
            >
                Klaim Audit Sekarang
            </Button>
            <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                            />
                        ))}
                    </div>
                    <div className="flex -space-x-2">
                        {AVATAR_INITIALS.map((initial, i) => (
                            <div
                                key={i}
                                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-background text-[10px] font-bold text-white ${AVATAR_COLORS[i]}`}
                            >
                                {initial}
                            </div>
                        ))}
                    </div>
                </div>
                <span className="text-xs text-muted-foreground">
                    4.9/5.0 Dipercaya 100+ Brand &amp; UMKM
                </span>
            </div>
        </div>
    );
}
