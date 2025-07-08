'use client';

export default function Sidebar() {
    return (
        <aside className="w-64 bg-white border-r border-gray-200 shadow-md min-h-screen sticky top-0">
            <div className="p-4">
                <h2 className="text-xl font-bold text-blue-700 mb-4">Admin Menu</h2>
                <nav className="space-y-2 text-sm">
                    <a href="/admin/dashboard" className="block px-3 py-2 rounded hover:bg-blue-100 text-blue-700 font-medium">
                        📊 Dashboard
                    </a>
                    <a href="/admin/rooms" className="block px-3 py-2 rounded hover:bg-blue-100">
                        🏨 Manage Rooms
                    </a>
                    <a href="/admin/bookings" className="block px-3 py-2 rounded hover:bg-blue-100">
                        📅 Manage Bookings
                    </a>
                </nav>
            </div>
        </aside>
    );
}
