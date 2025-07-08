'use client';

import { Dispatch, SetStateAction } from 'react';

type SortKey = 'created_at' | 'check_in' | 'check_out';

interface SidebarProps {
    filterThisWeek: boolean;
    setFilterThisWeek: Dispatch<SetStateAction<boolean>>;
    filterRoom: string;
    setFilterRoom: Dispatch<SetStateAction<string>>;
    sortBy: SortKey;
    setSortBy: Dispatch<SetStateAction<SortKey>>;
    uniqueRooms: string[];
}

export default function Sidebar({
    filterThisWeek,
    setFilterThisWeek,
    filterRoom,
    setFilterRoom,
    sortBy,
    setSortBy,
    uniqueRooms,
}: SidebarProps) {
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

                <div className="mt-6 border-t pt-4">
                    <h3 className="text-sm font-semibold text-gray-600 mb-3">📎 Filters</h3>

                    <label className="flex items-center gap-2 text-sm mb-3">
                        <input
                            type="checkbox"
                            checked={filterThisWeek}
                            onChange={() => setFilterThisWeek((prev) => !prev)}
                        />
                        This Week Only
                    </label>

                    <label className="block text-sm mb-1 text-gray-700">Room</label>
                    <select
                        className="w-full border px-2 py-1 rounded mb-3"
                        value={filterRoom}
                        onChange={(e) => setFilterRoom(e.target.value)}
                    >
                        <option value="all">All Rooms</option>
                        {uniqueRooms.map((room) => (
                            <option key={room} value={room}>
                                {room}
                            </option>
                        ))}
                    </select>

                    <label className="block text-sm mb-1 text-gray-700">Sort by</label>
                    <select
                        className="w-full border px-2 py-1 rounded"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortKey)}
                    >
                        <option value="created_at">Created At</option>
                        <option value="check_in">Check In</option>
                        <option value="check_out">Check Out</option>
                    </select>
                </div>
            </div>
        </aside>
    );
}
