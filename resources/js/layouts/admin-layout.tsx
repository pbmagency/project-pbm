import type { ReactNode } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface AdminLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AdminLayoutProps) => (
    <AppLayout breadcrumbs={breadcrumbs} {...props}>
        {children}
    </AppLayout>
);
