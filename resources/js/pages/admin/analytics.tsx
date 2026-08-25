import { Head, router } from '@inertiajs/react';
import {
    Download,
    Eye,
    MessageCircle,
    ShoppingCart,
    Target,
    TrendingUp,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { ConversionFunnel } from '@/components/analytics/conversion-funnel';
import { MetricCard } from '@/components/analytics/metric-card';
import { ReferralChart } from '@/components/analytics/referral-chart';
import { RevenueChart } from '@/components/analytics/revenue-chart';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Analytics', href: '/admin' },
];

interface AnalyticsProps {
    stats: {
        total_visits: number;
        unique_visitors: number;
        engagement_rate: number;
        engaged: number;
        intent: number;
        intent_rate: number;
        direct_checkouts: number;
        direct_checkout_rate: number;
        whatsapp_leads: number;
        whatsapp_lead_rate: number;
        total_leads: number;
        total_lead_rate: number;
        total_leads_from_intent_rate: number;
    };
    chartData: Record<string, any[]>;
    referralData: Array<{
        referral_source: string;
        count: number;
    }>;
    conversionFunnel: Array<{
        stage: string;
        count: number;
        percentage: number;
        transition_percentage: number;
        from_stage: string | null;
        branch: 'main' | 'checkout' | 'lead' | 'total';
    }>;
    dateRange: string;
}

export default function Analytics({
    stats,
    chartData,
    referralData,
    conversionFunnel,
    dateRange,
}: AnalyticsProps) {
    const [selectedRange, setSelectedRange] = useState(dateRange);

    const handleRangeChange = (range: string) => {
        setSelectedRange(range);
        router.get('/admin', { range }, { preserveState: true });
    };

    const handleExport = () => {
        window.open(`/admin/export?range=${selectedRange}`, '_blank');
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Analytics Dashboard" />

            <div className="min-h-screen bg-background">
                {/* Header */}
                <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
                    <div className="px-6 py-8">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">
                                    Analytics & A/B Dashboard
                                </h1>
                                <p className="mt-2 text-muted-foreground">
                                    Comprehensive insights into tracked user
                                    behavior and conversion metrics
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <Select
                                    value={selectedRange}
                                    onValueChange={handleRangeChange}
                                >
                                    <SelectTrigger className="w-40">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="7">
                                            Last 7 days
                                        </SelectItem>
                                        <SelectItem value="30">
                                            Last 30 days
                                        </SelectItem>
                                        <SelectItem value="90">
                                            Last 90 days
                                        </SelectItem>
                                        <SelectItem value="365">
                                            Last year
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button
                                    onClick={handleExport}
                                    variant="outline"
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Export CSV
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8 p-6">
                    {/* Primary Metrics */}
                    <div>
                        <h2 className="mb-6 text-xl font-semibold text-foreground">
                            Key Performance Indicators
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <MetricCard
                                title="Total Visits"
                                value={stats.total_visits.toLocaleString()}
                                icon={Eye}
                                description={`${stats.unique_visitors} unique visitors`}
                            />
                            <MetricCard
                                title="Engagement Rate"
                                value={`${stats.engagement_rate}%`}
                                icon={TrendingUp}
                                description={`${stats.engaged} engaged sessions (15s OR 25% scroll OR action)`}
                            />
                            <MetricCard
                                title="Intent Rate"
                                value={`${stats.intent_rate}%`}
                                icon={Target}
                                description={`${stats.intent} sessions clicked a CTA`}
                            />
                            <MetricCard
                                title="Direct Checkout"
                                value={`${stats.direct_checkout_rate}%`}
                                icon={ShoppingCart}
                                description={`${stats.direct_checkouts} external checkout redirects`}
                            />
                            <MetricCard
                                title="WhatsApp Lead Rate"
                                value={`${stats.whatsapp_lead_rate}%`}
                                icon={MessageCircle}
                                description={`${stats.whatsapp_leads} WhatsApp leads`}
                            />
                            <MetricCard
                                title="Total Leads"
                                value={stats.total_leads.toLocaleString()}
                                icon={Users}
                                description={`${stats.total_leads_from_intent_rate}% of Intent · ${stats.total_lead_rate}% of visits`}
                            />
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid gap-8 lg:grid-cols-2">
                        <RevenueChart data={chartData} />
                        <ReferralChart data={referralData} />
                    </div>

                    {/* Conversion Funnel */}
                    <ConversionFunnel data={conversionFunnel} />

                    {/* Insights Section */}
                    <div className="rounded-xl border border-border/50 bg-card/30 p-6 backdrop-blur-sm">
                        <h3 className="mb-4 text-lg font-semibold text-foreground">
                            Key Insights
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div className="rounded-lg border border-primary/20 bg-primary/10 p-4">
                                <div className="font-semibold text-primary">
                                    Top Referral Source
                                </div>
                                <div className="mt-1 text-sm text-muted-foreground">
                                    {referralData[0]?.referral_source ||
                                        'No data'}
                                    {referralData[0] &&
                                        ` (${referralData[0].count} visits)`}
                                </div>
                            </div>

                            <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4">
                                <div className="font-semibold text-green-400">
                                    Primary Conversion
                                </div>
                                <div className="mt-1 text-sm text-muted-foreground">
                                    Total Lead Rate: {stats.total_lead_rate}% (
                                    {stats.total_leads} unique leads)
                                </div>
                            </div>

                            <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
                                <div className="font-semibold text-blue-400">
                                    Lead Mix
                                </div>
                                <div className="mt-1 text-sm text-muted-foreground">
                                    {stats.direct_checkouts} Direct Checkout ·{' '}
                                    {stats.whatsapp_leads} WhatsApp Leads
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
