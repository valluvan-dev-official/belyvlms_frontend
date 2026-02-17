import React from 'react';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from '../components/ui/breadcrumb';

export const BatchesPage: React.FC = () => {
    return (
        <div className="p-6">
            <div className="mb-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/management">Management</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Batches</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className="text-2xl font-bold text-[#1A1D1F] mt-2">Batch Management</h1>
                <p className="text-[#6E7191] mt-1">Manage your batches here.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#E0E0E2] flex items-center justify-center h-64">
                <p className="text-[#6E7191]">Batch Management Module coming soon.</p>
            </div>
        </div>
    );
};
