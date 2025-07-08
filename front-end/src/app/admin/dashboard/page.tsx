'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Sidebar from '../../components/admin/Sidebar';
import BookingChart from '../BookingChart';

interface Booking {
    id: number;
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

    const stats = {
        totalBookings: bookings.length,
        totalGuests: bookings.reduce((sum, b) => sum + b.guests, 0),
        totalIncome: bookings.reduce((sum, b) => {
            const price = { 1: 100, 2: 150, 3: 250 }[b.room_id] || 0;
            const nights = (new Date(b.check_out).getTime() - new Date(b.check_in).getTime()) / (1000 * 3600 * 24);
            return sum + price * nights;
        }, 0),
        mostBookedRoom: (() => {
            const count: Record<string, number> = {};
            bookings.forEach((b) => (count[b.room_name] = (count[b.room_name] || 0) + 1));
            return Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';
        })(),
        upcomingBookings: bookings.filter((b) => {
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);
            const checkIn = new Date(b.check_in);
            return checkIn.toDateString() === today.toDateString() || checkIn.toDateString() === tomorrow.toDateString();
        }).length,
    };

    const uniqueRooms = Array.from(new Set(bookings.map((b) => b.room_name)));

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
                <motion.h1
                    className="text-3xl font-bold mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    📊 Admin Dashboard
                </motion.h1>

                {loading ? (
                    <p className="text-gray-600">Loading data...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <StatCard title="🧾 Total Bookings" value={stats.totalBookings} />
                        <StatCard title="💰 Total Income" value={`$${stats.totalIncome}`} />
                        <StatCard title="👥 Total Guests" value={stats.totalGuests} />
                        <StatCard title="🏨 Most Booked Room" value={stats.mostBookedRoom} />
                        <StatCard title="📅 Upcoming Bookings" value={stats.upcomingBookings} />
                    </div>

                )}
                <div className="mt-10">
                    <BookingChart bookings={bookings} />
                </div>
            </main>
        </div>
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
