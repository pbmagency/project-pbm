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

// Convert "19:00" to "07:00 PM"
function formatTimeTo12Hour(time: string) {
    if (!time) return '';
    let [hours, minutes] = time.split(':');
    if (!hours || !minutes) return time;
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12; // 0 becomes 12
    return `${h.toString().padStart(2, '0')}:${minutes} ${ampm}`;
}

// Convert "07:00 PM" to "19:00" (needed to populate the native time input)
function parse12HourTo24Hour(timeStr: string) {
    if (!timeStr) return '';
    const match = timeStr.trim().match(/(\d{2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return timeStr.trim(); // fallback if already 24h
    let h = parseInt(match[1], 10);
    const m = match[2];
    const ampm = match[3].toUpperCase();
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${m}`;
}

interface ConfigsProps {
    settings: Record<string, string>;
}

export default function Configs({ settings }: ConfigsProps) {
    // Parse the stored time string which could now be "07:00 PM - 08:30 PM"
    const initialTime = settings.event_time || '07:00 PM - 08:30 PM';
    const [startPart, endPart] = initialTime.split('-').map(s => s.trim());
    
    const initialStart = parse12HourTo24Hour(startPart || '19:00');
    const initialEnd = parse12HourTo24Hour(endPart || '20:30');

    // Parse the stored date string (e.g., "16 JULI 2026") into YYYY-MM-DD
    const initialDateISO = settings.event_date ? parseIndonesianDateToISO(settings.event_date) : '';

    const { data, setData, post, processing, errors, transform } = useForm({
        event_date: '', // To avoid TS errors
        event_time: '', // To avoid TS errors
        raw_date: initialDateISO, // Bound to the actual date picker
        start_time: initialStart,
        end_time: initialEnd,
        zoom_link: settings.zoom_link || '',
        wa_group_link: settings.wa_group_link || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Transform values to standard Indonesian date and 12-hour AM/PM time
        transform((data) => ({
            event_date: formatDateToIndonesian(data.raw_date),
            event_time: `${formatTimeTo12Hour(data.start_time)} - ${formatTimeTo12Hour(data.end_time)}`,
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
                                    <Input
                                        type="time"
                                        value={data.start_time}
                                        onChange={(e) => setData('start_time', e.target.value)}
                                        onClick={(e) => e.currentTarget.showPicker && e.currentTarget.showPicker()}
                                        className="w-[140px] cursor-pointer"
                                        required
                                    />
                                    <span className="text-sm font-medium text-muted-foreground">to</span>
                                    <Input
                                        type="time"
                                        value={data.end_time}
                                        onChange={(e) => setData('end_time', e.target.value)}
                                        onClick={(e) => e.currentTarget.showPicker && e.currentTarget.showPicker()}
                                        className="w-[140px] cursor-pointer"
                                        required
                                    />
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