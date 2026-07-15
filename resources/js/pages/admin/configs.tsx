import { Head, useForm, usePage } from '@inertiajs/react';
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

interface ConfigsProps {
    settings: Record<string, string>;
}

export default function Configs({ settings }: ConfigsProps) {
    // Parse the stored time string (e.g., "19:00 - 20:30 WIB") to get start, end, and suffix
    const initialTime = settings.event_time || '19:00 - 20:30 WIB';
    const timeMatch = initialTime.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})\s*(.*)/);
    
    const initialStart = timeMatch ? timeMatch[1] : '19:00';
    const initialEnd = timeMatch ? timeMatch[2] : '20:30';
    const initialSuffix = timeMatch && timeMatch[3] ? timeMatch[3] : 'WIB';

    const { data, setData, post, processing, errors, transform } = useForm({
        event_date: settings.event_date || '',
        start_time: initialStart,
        end_time: initialEnd,
        event_time: '',
        time_suffix: initialSuffix,
        zoom_link: settings.zoom_link || '',
        wa_group_link: settings.wa_group_link || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Combine the start, end, and suffix back into the format the backend expects
        transform((data) => ({
            event_date: data.event_date,
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
                                <Label htmlFor="event_date">Event Date</Label>
                                <Input
                                    id="event_date"
                                    type="text"
                                    value={data.event_date}
                                    onChange={(e) => setData('event_date', e.target.value)}
                                    placeholder="e.g. 16 JULI 2026"
                                    className="max-w-md"
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
                                        className="w-[140px]"
                                        required
                                    />
                                    <span className="text-sm font-medium text-muted-foreground">to</span>
                                    <Input
                                        type="time"
                                        value={data.end_time}
                                        onChange={(e) => setData('end_time', e.target.value)}
                                        className="w-[140px]"
                                        required
                                    />
                                    <select
                                        value={data.time_suffix}
                                        onChange={(e) => setData('time_suffix', e.target.value)}
                                        className="flex h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    >
                                        <option value="AM">AM</option>
                                        <option value="PM">PM</option>
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