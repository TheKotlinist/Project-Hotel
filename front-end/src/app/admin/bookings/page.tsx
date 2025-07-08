'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/admin/Sidebar';

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

export default function ManageBookingsPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterThisWeek, setFilterThisWeek] = useState(false);
    const [filterRoom, setFilterRoom] = useState('all');
    const [sortBy, setSortBy] = useState<SortKey>('created_at');

    const uniqueRooms = Array.from(new Set(bookings.map((b) => b.room_name)));

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
            console.error('Gagal mengambil data booking:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin ingin hapus booking ini?')) return;
        try {
            await fetch(`http://localhost:3001/bookings/${id}`, { method: 'DELETE' });
            setBookings((prev) => prev.filter((b) => b.id !== id));
        } catch (error) {
            console.error('Gagal menghapus data:', error);
            alert('Gagal menghapus data.');
        }
    };

    const getFilteredSortedBookings = () => {
        const isThisWeek = (dateStr: string) => {
            const date = new Date(dateStr);
            const today = new Date();
            const start = new Date(today);
            const end = new Date(today);
            start.setDate(today.getDate() - today.getDay());
            end.setDate(start.getDate() + 6);
            return date >= start && date <= end;
        };

        return bookings
            .filter((b) => (filterThisWeek ? isThisWeek(b.check_in) : true))
            .filter((b) => (filterRoom === 'all' ? true : b.room_name === filterRoom))
            .sort((a, b) => new Date(b[sortBy]).getTime() - new Date(a[sortBy]).getTime());
    };

    const filteredBookings = getFilteredSortedBookings();

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar
                filterThisWeek={filterThisWeek}
                setFilterThisWeek={setFilterThisWeek}
                filterRoom={filterRoom}
                setFilterRoom={setFilterRoom}
                sortBy={sortBy}
                setSortBy={setSortBy}
                uniqueRooms={uniqueRooms}
            />

            <main className="flex-1 p-6">
                <h1 className="text-3xl font-bold mb-6 text-blue-800">📅 Manage Bookings</h1>

                {loading ? (
                    <p>Loading bookings...</p>
                ) : filteredBookings.length === 0 ? (
                    <p>Tidak ada data booking.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto border border-gray-300 bg-white shadow-md rounded-lg">
                            <thead className="bg-blue-600 text-white text-sm">
                                <tr>
                                    <th className="px-4 py-2 text-left">#</th>
                                    <th className="px-4 py-2 text-left">Nama</th>
                                    <th className="px-4 py-2 text-left">Email</th>
                                    <th className="px-4 py-2 text-left">Kamar</th>
                                    <th className="px-4 py-2 text-left">Tamu</th>
                                    <th className="px-4 py-2 text-left">Check-In</th>
                                    <th className="px-4 py-2 text-left">Check-Out</th>
                                    <th className="px-4 py-2 text-left">Dibuat</th>
                                    <th className="px-4 py-2 text-left">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map((b, i) => (
                                    <tr key={b.id} className="border-t hover:bg-gray-50 text-sm">
                                        <td className="px-4 py-2">{i + 1}</td>
                                        <td className="px-4 py-2">{b.name}</td>
                                        <td className="px-4 py-2">{b.email}</td>
                                        <td className="px-4 py-2">{b.room_name}</td>
                                        <td className="px-4 py-2">{b.guests}</td>
                                        <td className="px-4 py-2">{b.check_in}</td>
                                        <td className="px-4 py-2">{b.check_out}</td>
                                        <td className="px-4 py-2">{new Date(b.created_at).toLocaleString()}</td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => handleDelete(b.id)}
                                                className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
