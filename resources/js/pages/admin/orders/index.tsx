import { Head, router, useForm } from '@inertiajs/react';
import {
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Search,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Orders', href: '/admin/orders' },
];

interface Order {
    id: number;
    order_number: string;
    name: string;
    email: string;
    phone: string;
    amount: number;
    status: 'pending' | 'paid' | 'failed';
    payment_method: string | null;
    created_at: string;
}

interface PaginatedOrders {
    data: Order[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface OrdersProps {
    orders: PaginatedOrders;
    filters: {
        search?: string;
        status?: string;
        sort?: string;
        direction?: string;
    };
}

function formatRupiah(amount: number): string {
    return 'Rp' + amount.toLocaleString('id-ID');
}

function StatusBadge({ status }: { status: Order['status'] }) {
    const variants: Record<Order['status'], string> = {
        paid: 'bg-green-500/15 text-green-400 border-green-500/30',
        pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
        failed: 'bg-red-500/15 text-red-400 border-red-500/30',
    };

    const labels: Record<Order['status'], string> = {
        paid: 'Paid',
        pending: 'Pending',
        failed: 'Failed',
    };

    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${variants[status]}`}>
            {labels[status]}
        </span>
    );
}

export default function OrdersIndex({ orders, filters }: OrdersProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    const applyFilters = (overrides: Partial<typeof filters> = {}) => {
        router.get('/admin/orders', {
            search,
            status,
            sort: filters.sort,
            direction: filters.direction,
            ...overrides,
        }, { preserveState: true });
    };

    const toggleSort = (field: string) => {
        const newDir = filters.sort === field && filters.direction === 'asc' ? 'desc' : 'asc';
        applyFilters({ sort: field, direction: newDir });
    };

    const deleteOrder = (order: Order) => {
        if (!confirm(`Hapus order ${order.order_number}?`)) {
            return;
        }
        router.delete(`/admin/orders/${order.id}`, { preserveScroll: true });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders — Admin" />

            <div className="min-h-screen bg-background">
                <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
                    <div className="px-6 py-8">
                        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
                        <p className="mt-1 text-muted-foreground">
                            {orders.total} total orders
                        </p>
                    </div>
                </div>

                <div className="p-6">
                    {/* Filters */}
                    <div className="mb-6 flex flex-wrap gap-3">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Cari nama, email, order..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-ring"
                            />
                        </div>

                        <select
                            value={status}
                            onChange={(e) => { setStatus(e.target.value); applyFilters({ status: e.target.value }); }}
                            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none"
                        >
                            <option value="">Semua Status</option>
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                        </select>

                        <Button onClick={() => applyFilters()} size="sm">
                            Filter
                        </Button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border/50">
                                    {[
                                        { field: 'order_number', label: 'Order #' },
                                        { field: 'name', label: 'Nama' },
                                        { field: 'email', label: 'Email' },
                                        { field: 'phone', label: 'Phone' },
                                        { field: 'amount', label: 'Amount' },
                                        { field: 'status', label: 'Status' },
                                        { field: 'created_at', label: 'Tanggal' },
                                    ].map(({ field, label }) => (
                                        <th
                                            key={field}
                                            className="px-4 py-3 text-left font-medium text-muted-foreground"
                                        >
                                            <button
                                                onClick={() => toggleSort(field)}
                                                className="flex items-center gap-1 hover:text-foreground"
                                            >
                                                {label}
                                                <ArrowUpDown className="h-3 w-3" />
                                            </button>
                                        </th>
                                    ))}
                                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {orders.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                                            Tidak ada order.
                                        </td>
                                    </tr>
                                ) : (
                                    orders.data.map((order) => (
                                        <tr key={order.id} className="transition-colors hover:bg-muted/20">
                                            <td className="px-4 py-3 font-mono text-xs text-foreground">
                                                {order.order_number}
                                            </td>
                                            <td className="px-4 py-3 text-foreground">{order.name}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{order.email}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{order.phone}</td>
                                            <td className="px-4 py-3 font-medium text-foreground">
                                                {formatRupiah(order.amount)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusBadge status={order.status} />
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {new Date(order.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => deleteOrder(order)}
                                                    className="text-muted-foreground hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {orders.last_page > 1 && (
                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Halaman {orders.current_page} dari {orders.last_page}
                                {' '}({orders.total} total)
                            </p>
                            <div className="flex gap-2">
                                {orders.current_page > 1 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.get('/admin/orders', { ...filters, page: orders.current_page - 1 })}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Prev
                                    </Button>
                                )}
                                {orders.current_page < orders.last_page && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.get('/admin/orders', { ...filters, page: orders.current_page + 1 })}
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
