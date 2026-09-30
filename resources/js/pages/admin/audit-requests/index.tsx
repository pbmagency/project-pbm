import { Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/admin-layout';
import type { BreadcrumbItem } from '@/types';

interface AuditRequest {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

interface PaginatedAuditRequests {
    data: AuditRequest[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
}

interface AuditRequestsProps {
    requests: PaginatedAuditRequests;
    filters: {
        search: string;
        from: string;
        to: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Permintaan Audit', href: '/admin/audit-requests' },
];

function formatSubmittedAt(value: string): string {
    return `${new Date(value).toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    })} WIB`;
}

export default function AuditRequestsIndex({
    requests,
    filters,
}: AuditRequestsProps) {
    const [search, setSearch] = useState(filters.search);
    const [from, setFrom] = useState(filters.from);
    const [to, setTo] = useState(filters.to);

    const applyFilters = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        router.get(
            '/admin/audit-requests',
            {
                search: search.trim() || undefined,
                from: from || undefined,
                to: to || undefined,
            },
            { replace: true },
        );
    };

    const resetFilters = () => {
        setSearch('');
        setFrom('');
        setTo('');
        router.get('/admin/audit-requests', {}, { replace: true });
    };

    const goToPage = (page: number) => {
        router.get(
            '/admin/audit-requests',
            {
                ...filters,
                page,
            },
            { preserveScroll: true },
        );
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Permintaan Audit — Admin" />

            <div className="min-h-screen bg-background">
                <div className="border-b border-border/50 bg-card/30 px-6 py-8">
                    <h1 className="text-3xl font-bold text-foreground">
                        Permintaan Audit
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Nama dan email yang dikirim melalui form audit di
                        halaman utama.
                    </p>
                </div>

                <div className="space-y-6 p-6">
                    <form
                        onSubmit={applyFilters}
                        className="flex flex-wrap items-end gap-3"
                        aria-label="Filter permintaan audit"
                    >
                        <label className="min-w-[220px] flex-1 text-sm font-medium text-foreground">
                            Cari nama atau email
                            <span className="relative mt-1 block">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Nama atau email"
                                    className="h-10 w-full rounded-lg border border-border bg-card pr-3 pl-10 text-sm text-foreground outline-none focus:border-ring"
                                />
                            </span>
                        </label>
                        <label className="text-sm font-medium text-foreground">
                            Dari tanggal
                            <input
                                type="date"
                                value={from}
                                max={to || undefined}
                                onChange={(event) =>
                                    setFrom(event.target.value)
                                }
                                className="mt-1 block h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-ring"
                            />
                        </label>
                        <label className="text-sm font-medium text-foreground">
                            Sampai tanggal
                            <input
                                type="date"
                                value={to}
                                min={from || undefined}
                                onChange={(event) => setTo(event.target.value)}
                                className="mt-1 block h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-ring"
                            />
                        </label>
                        <Button type="submit">Terapkan</Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={resetFilters}
                        >
                            Reset
                        </Button>
                    </form>

                    <div className="overflow-x-auto rounded-xl border border-border/50 bg-card/30">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-border/50 bg-muted/30 text-muted-foreground">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 font-semibold"
                                    >
                                        Nama
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 font-semibold"
                                    >
                                        Email
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-3 font-semibold"
                                    >
                                        Waktu mengisi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="px-4 py-12 text-center text-muted-foreground"
                                        >
                                            Belum ada permintaan audit yang
                                            cocok dengan filter.
                                        </td>
                                    </tr>
                                ) : (
                                    requests.data.map((request) => (
                                        <tr
                                            key={request.id}
                                            className="border-b border-border/40 last:border-0"
                                        >
                                            <td className="px-4 py-3 font-medium text-foreground">
                                                {request.name || '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                {request.email ? (
                                                    <a
                                                        className="text-primary hover:underline"
                                                        href={`mailto:${request.email}`}
                                                    >
                                                        {request.email}
                                                    </a>
                                                ) : (
                                                    '—'
                                                )}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                                                {formatSubmittedAt(
                                                    request.created_at,
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                        <span>
                            {requests.total === 0
                                ? '0 data'
                                : `${requests.from}–${requests.to} dari ${requests.total} data`}
                        </span>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={requests.current_page <= 1}
                                onClick={() =>
                                    goToPage(requests.current_page - 1)
                                }
                            >
                                <ChevronLeft className="size-4" /> Sebelumnya
                            </Button>
                            <span className="px-2">
                                {requests.current_page} / {requests.last_page}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={
                                    requests.current_page >= requests.last_page
                                }
                                onClick={() =>
                                    goToPage(requests.current_page + 1)
                                }
                            >
                                Berikutnya <ChevronRight className="size-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
