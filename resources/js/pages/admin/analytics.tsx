import { Head, router } from '@inertiajs/react';
import {
    CreditCard,
    DollarSign,
    Download,
    Eye,
    MousePointerClick,
    ShoppingCart,
    Target,
    TrendingUp,
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
import { formatCurrency } from '@/lib/safe-data';
import type { BreadcrumbItem } from '@/types';
import type {
    AnalyticsStats,
    FunnelStage,
    ReferralDataItem,
} from '@/types/analytics';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Analytics', href: '/admin' },
];

interface AnalyticsProps {
    stats: AnalyticsStats;
    chartData: Record<string, Array<{ date: string; total: number }>>;
    referralData: ReferralDataItem[];
    conversionFunnel: FunnelStage[];
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
                <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
                    <div className="px-6 py-8">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">
                                    Analytics Dashboard
                                </h1>
                                <p className="mt-2 text-muted-foreground">
                                    Comprehensive insights into user behavior
                                    and conversion metrics
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
                    <div>
                        <h2 className="mb-6 text-xl font-semibold text-foreground">
                            Key Performance Indicators
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                                description={`${stats.engaged_users} engaged sessions`}
                            />
                            <MetricCard
                                title="Intent Rate"
                                value={`${stats.intent_rate}%`}
                                icon={MousePointerClick}
                                description={`${stats.cta_clicks} CTA clicks`}
                            />
                            <MetricCard
                                title="Add to Cart Rate"
                                value={`${stats.add_to_cart_rate}%`}
                                icon={ShoppingCart}
                                description={`${stats.add_to_cart} add to cart clicks`}
                            />
                            <MetricCard
                                title="Conversion Rate"
                                value={`${stats.conversion_rate}%`}
                                icon={Target}
                                description={`${stats.conversions} conversions`}
                            />
                            <MetricCard
                                title="Conversion to Payment"
                                value={`${stats.conversion_to_payment_rate}%`}
                                icon={CreditCard}
                                description={`${stats.payments} successful payments`}
                            />
                            <MetricCard
                                title="Visit to Payment Rate"
                                value={`${stats.payment_rate}%`}
                                icon={CreditCard}
                                description={`${stats.payments} successful payments`}
                            />
                            <MetricCard
                                title="Total Revenue"
                                value={formatCurrency(stats.total_revenue)}
                                icon={DollarSign}
                                description={`${stats.payments}x payments`}
                            />
                        </div>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-2">
                        <RevenueChart data={chartData} />
                        <ReferralChart data={referralData} />
                    </div>

                    <ConversionFunnel data={conversionFunnel} />

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

                            <div className="rounded-lg border border-chart-2/20 bg-chart-2/10 p-4">
                                <div className="font-semibold text-chart-2">
                                    Revenue per Visit
                                </div>
                                <div className="mt-1 text-sm text-muted-foreground">
                                    {stats.total_visits > 0
                                        ? formatCurrency(
                                              stats.total_revenue /
                                                  stats.total_visits,
                                          )
                                        : 'Rp 0'}
                                </div>
                            </div>

                            <div className="rounded-lg border border-chart-1/20 bg-chart-1/10 p-4">
                                <div className="font-semibold text-chart-1">
                                    Avg. Revenue per User
                                </div>
                                <div className="mt-1 text-sm text-muted-foreground">
                                    {stats.unique_visitors > 0
                                        ? formatCurrency(
                                              stats.total_revenue /
                                                  stats.unique_visitors,
                                          )
                                        : 'Rp 0'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
