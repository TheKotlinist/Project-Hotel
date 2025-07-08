// app/admin/layout.tsx
'use client';

import Sidebar from '../components/admin/SidebarBasic';
import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar tampil di semua halaman admin */}
            <Sidebar />

            {/* Halaman utama */}
            <main className="flex-1 p-6 overflow-auto">
                {children}
            </main>
        </div>
    );
}
