import { Head, useForm } from '@inertiajs/react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Configurations', href: '/admin/configs' },
];

const ID_MONTHS = [
    'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI',
    'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'
];

// Generate times from 00:00 to 23:30 in 30-minute increments
const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
    const hours = Math.floor(i / 2).toString().padStart(2, '0');
    const minutes = i % 2 === 0 ? '00' : '30';
    return `${hours}:${minutes}`;
});

function formatDateToIndonesian(dateString: string) {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    if (!year || !month || !day) return dateString;
    const monthName = ID_MONTHS[parseInt(month, 10) - 1];
    return `${parseInt(day, 10)} ${monthName} ${year}`;
}

function parseIndonesianDateToISO(indoDate: string) {
    if (!indoDate) return '';
    const parts = indoDate.split(' ');
    if (parts.length !== 3) return '';
    const day = parts[0].padStart(2, '0');
    const monthIndex = ID_MONTHS.indexOf(parts[1].toUpperCase());
    if (monthIndex === -1) return '';
    const month = (monthIndex + 1).toString().padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
}

interface ConfigsProps {
    settings: Record<string, string>;
}

export default function Configs({ settings }: ConfigsProps) {
    // Parse the stored time string (e.g., "19:00 - 20:30 WIB")
    const initialTime = settings.event_time || '19:00 - 20:30 WIB';
    const timeMatch = initialTime.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})\s*(.*)/);
    
    const initialStart = timeMatch ? timeMatch[1] : '19:00';
    const initialEnd = timeMatch ? timeMatch[2] : '20:30';
    const initialSuffix = timeMatch && timeMatch[3] ? timeMatch[3] : 'WIB';

    // Parse the stored date string (e.g., "16 JULI 2026") into YYYY-MM-DD
    const initialDateISO = settings.event_date ? parseIndonesianDateToISO(settings.event_date) : '';

    const { data, setData, post, processing, errors, transform } = useForm({
        event_date: '', // To avoid TS errors
        event_time: '', // To avoid TS errors
        raw_date: initialDateISO, // Bound to the actual date picker
        start_time: initialStart,
        end_time: initialEnd,
        time_suffix: initialSuffix,
        zoom_link: settings.zoom_link || '',
        wa_group_link: settings.wa_group_link || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Transform the separated/raw values back into the format the backend/frontend expects
        transform((data) => ({
            event_date: formatDateToIndonesian(data.raw_date),
            event_time: `${data.start_time} - ${data.end_time} ${data.time_suffix}`,
            zoom_link: data.zoom_link,
            wa_group_link: data.wa_group_link,
        }));

        post('/admin/configs', {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Configurations" />

            <div className="min-h-screen bg-background p-6">
                <div className="mx-auto max-w-2xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground">
                            Webinar Configurations
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Update the variables for the landing page and email notifications.
                        </p>
                    </div>

                    <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm">
                        <div className="mb-6 flex items-center gap-2 border-b border-border/50 pb-4">
                            <Settings className="h-5 w-5 text-primary" />
                            <h2 className="text-lg font-semibold">
                                Global Settings
                            </h2>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="raw_date">Event Date</Label>
                                <Input
                                    id="raw_date"
                                    type="date"
                                    value={data.raw_date}
                                    onChange={(e) => setData('raw_date', e.target.value)}
                                    className="max-w-[200px]"
                                    required
                                />
                                {errors.event_date && (
                                    <p className="text-sm text-destructive">{errors.event_date}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Event Time Range</Label>
                                <div className="flex items-center gap-3">
                                    <select
                                        value={data.start_time}
                                        onChange={(e) => setData('start_time', e.target.value)}
                                        className="flex h-10 w-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    >
                                        {TIME_OPTIONS.map((time) => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                    <span className="text-sm font-medium text-muted-foreground">to</span>
                                    <select
                                        value={data.end_time}
                                        onChange={(e) => setData('end_time', e.target.value)}
                                        className="flex h-10 w-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    >
                                        {TIME_OPTIONS.map((time) => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={data.time_suffix}
                                        onChange={(e) => setData('time_suffix', e.target.value)}
                                        className="flex h-10 w-[90px] rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    >
                                        <option value="WIB">WIB</option>
                                        <option value="WITA">WITA</option>
                                        <option value="WIT">WIT</option>
                                    </select>
                                </div>
                                {errors.event_time && (
                                    <p className="text-sm text-destructive">{errors.event_time}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="zoom_link">Zoom Link</Label>
                                <Input
                                    id="zoom_link"
                                    type="url"
                                    value={data.zoom_link}
                                    onChange={(e) => setData('zoom_link', e.target.value)}
                                    placeholder="https://zoom.us/..."
                                    className="w-full"
                                />
                                {errors.zoom_link && (
                                    <p className="text-sm text-destructive">{errors.zoom_link}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="wa_group_link">WhatsApp Group Link</Label>
                                <Input
                                    id="wa_group_link"
                                    type="url"
                                    value={data.wa_group_link}
                                    onChange={(e) => setData('wa_group_link', e.target.value)}
                                    placeholder="https://chat.whatsapp.com/..."
                                    className="w-full"
                                />
                                {errors.wa_group_link && (
                                    <p className="text-sm text-destructive">{errors.wa_group_link}</p>
                                )}
                            </div>

                            <div className="pt-4">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Configurations'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}