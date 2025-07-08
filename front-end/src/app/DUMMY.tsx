// ini buat admin-dashboard cadangan

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface Booking {
    id: number;
    name: string;
    email: string;
    room_id: number;
    room_name: string;
    guests: number;
    check_in: string;
    check_out: string;
    created_at: string;
}

type SortKey = 'created_at' | 'check_in' | 'check_out';

export default function AdminDashboard() {
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterThisWeek, setFilterThisWeek] = useState(false);
    const [filterRoom, setFilterRoom] = useState('all');
    const [sortBy, setSortBy] = useState<SortKey>('created_at');

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('adminAuth');
        if (isLoggedIn !== 'true') {
            router.push('/admin/login');
            return;
        }

        fetchBookings();
    }, [router]);

    const fetchBookings = async () => {
        try {
            const res = await fetch('http://localhost:3001/bookings');
            const data = await res.json();
            setBookings(data);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this booking?')) return;

        try {
            const res = await fetch(`http://localhost:3001/bookings/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete booking');
            setBookings((prev) => prev.filter((b) => b.id !== id));
        } catch (error) {
            console.error('Error deleting booking:', error);
            alert('Gagal menghapus booking.');
        }
    };

    const totalBookings = bookings.length;
    const totalGuests = bookings.reduce((sum, b) => sum + b.guests, 0);

    const getTotalIncome = () => {
        const roomPrices: Record<number, number> = {
            1: 100,
            2: 150,
            3: 250,
        };
        return bookings.reduce((sum, b) => {
            const pricePerNight = roomPrices[b.room_id] || 0;
            const nights =
                (new Date(b.check_out).getTime() - new Date(b.check_in).getTime()) /
                (1000 * 3600 * 24);
            return sum + pricePerNight * nights;
        }, 0);
    };

    const totalIncome = getTotalIncome();

    const getMostBookedRoom = () => {
        const count: Record<string, number> = {};
        bookings.forEach((b) => {
            count[b.room_name] = (count[b.room_name] || 0) + 1;
        });
        const sorted = Object.entries(count).sort((a, b) => b[1] - a[1]);
        return sorted[0]?.[0] || '-';
    };

    const mostBookedRoom = getMostBookedRoom();

    const getUpcomingBookings = () => {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        return bookings.filter((b) => {
            const checkIn = new Date(b.check_in);
            return (
                checkIn.toDateString() === today.toDateString() ||
                checkIn.toDateString() === tomorrow.toDateString()
            );
        }).length;
    };

    const upcomingBookings = getUpcomingBookings();

    const isThisWeek = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const dayOfWeek = today.getDay();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek);
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        return date >= startOfWeek && date <= endOfWeek;
    };

    const sortBookings = (a: Booking, b: Booking, key: SortKey) => {
        return new Date(b[key]).getTime() - new Date(a[key]).getTime();
    };

    const filteredBookings = bookings
        .filter((b) => (filterThisWeek ? isThisWeek(b.check_in) : true))
        .filter((b) => (filterRoom === 'all' ? true : b.room_name === filterRoom))
        .sort((a, b) => sortBookings(a, b, sortBy));

    const uniqueRooms = Array.from(new Set(bookings.map((b) => b.room_name)));

    return (
        <motion.div
            className="p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <motion.h1
                className="text-3xl font-bold mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                📋 Admin Dashboard
            </motion.h1>

            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {},
                    visible: {
                        transition: { staggerChildren: 0.1 },
                    },
                }}
            >
                <StatCard title="🧾 Total Bookings" value={totalBookings} />
                <StatCard title="💰 Total Income" value={`$${totalIncome}`} />
                <StatCard title="👥 Total Guests" value={totalGuests} />
                <StatCard title="🏨 Most Booked Room" value={mostBookedRoom} />
                <StatCard title="📅 Upcoming Bookings" value={upcomingBookings} />
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
                <UpcomingCard
                    title="🔴 Check-in Today"
                    dateFilter={(checkIn) => {
                        const today = new Date();
                        return new Date(checkIn).toDateString() === today.toDateString();
                    }}
                    bookings={bookings}
                />
                <UpcomingCard
                    title="🟡 Check-in Tomorrow"
                    dateFilter={(checkIn) => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        return new Date(checkIn).toDateString() === tomorrow.toDateString();
                    }}
                    bookings={bookings}
                />
            </div>

            {/* FILTERS */}
            <motion.div
                className="flex flex-wrap gap-4 items-center mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                        type="checkbox"
                        checked={filterThisWeek}
                        onChange={() => setFilterThisWeek(!filterThisWeek)}
                    />
                    Show Check-in This Week Only
                </label>

                <select
                    className="border rounded px-3 py-1 text-sm"
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

                <select
                    className="border rounded px-3 py-1 text-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortKey)}
                >
                    <option value="created_at">Sort by Created At</option>
                    <option value="check_in">Sort by Check-In</option>
                    <option value="check_out">Sort by Check-Out</option>
                </select>
            </motion.div>

            {loading ? (
                <p className="text-gray-600">Loading bookings...</p>
            ) : filteredBookings.length === 0 ? (
                <p className="text-gray-600">No bookings found.</p>
            ) : (
                <motion.div
                    className="overflow-x-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <table className="min-w-full table-auto border border-gray-200 bg-white shadow-md rounded-lg">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="px-4 py-2 text-left">#</th>
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Email</th>
                                <th className="px-4 py-2 text-left">Room</th>
                                <th className="px-4 py-2 text-left">Guests</th>
                                <th className="px-4 py-2 text-left">Check-In</th>
                                <th className="px-4 py-2 text-left">Check-Out</th>
                                <th className="px-4 py-2 text-left">Created At</th>
                                <th className="px-4 py-2 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((b, i) => (
                                <tr key={b.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-2">{i + 1}</td>
                                    <td className="px-4 py-2">{b.name}</td>
                                    <td className="px-4 py-2">{b.email}</td>
                                    <td className="px-4 py-2">{b.room_name}</td>
                                    <td className="px-4 py-2">{b.guests}</td>
                                    <td className="px-4 py-2">{b.check_in}</td>
                                    <td className="px-4 py-2">{b.check_out}</td>
                                    <td className="px-4 py-2 text-sm text-gray-500">
                                        {new Date(b.created_at).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleDelete(b.id)}
                                            className="bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700 transition"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            )}
        </motion.div>
    );
}

function StatCard({ title, value }: { title: string; value: number | string }) {
    return (
        <motion.div
            className="bg-white shadow-md rounded-xl p-4 text-center border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <h3 className="text-sm text-gray-500 mb-2">{title}</h3>
            <p className="text-xl font-bold text-gray-800">{value}</p>
        </motion.div>
    );
}

function UpcomingCard({
    title,
    dateFilter,
    bookings,
}: {
    title: string;
    dateFilter: (checkIn: string) => boolean;
    bookings: Booking[];
}) {
    const filtered = bookings.filter((b) => dateFilter(b.check_in));

    return (
        <motion.div
            className="bg-white border border-gray-200 rounded-xl shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {title} ({filtered.length} booking{filtered.length !== 1 && 's'})
            </h3>
            {filtered.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No bookings.</p>
            ) : (
                <ul className="space-y-2 text-sm text-gray-700">
                    {filtered.map((b) => (
                        <li key={b.id} className="border-b pb-2">
                            <span className="font-medium">{b.name}</span> — {b.room_name} Room, {b.guests} guest(s)
                        </li>
                    ))}
                </ul>
            )}
        </motion.div>
    );
}
