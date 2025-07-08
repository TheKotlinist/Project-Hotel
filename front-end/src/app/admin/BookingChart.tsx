'use client';

import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, LineElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement } from 'chart.js';

ChartJS.register(BarElement, LineElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement);

interface Booking {
    check_in: string;
    room_id: number;
}

interface Props {
    bookings: Booking[];
}

function getWeekKey(date: Date): string {
    const first = date.getDate() - date.getDay();
    const weekStart = new Date(date.setDate(first));
    return `${weekStart.getFullYear()}-W${Math.ceil((weekStart.getDate() + 6) / 7)}`;
}

function getMonthKey(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
}

export default function BookingChart({ bookings }: Props) {
    const weekData: Record<string, number> = {};
    const monthData: Record<string, number> = {};
    const incomeWeekData: Record<string, number> = {};
    const incomeMonthData: Record<string, number> = {};

    bookings.forEach((b) => {
        const checkIn = new Date(b.check_in);
        const weekKey = getWeekKey(new Date(b.check_in));
        const monthKey = getMonthKey(checkIn);
        const price = { 1: 100, 2: 150, 3: 250 }[b.room_id] || 0;

        weekData[weekKey] = (weekData[weekKey] || 0) + 1;
        incomeWeekData[weekKey] = (incomeWeekData[weekKey] || 0) + price;

        monthData[monthKey] = (monthData[monthKey] || 0) + 1;
        incomeMonthData[monthKey] = (incomeMonthData[monthKey] || 0) + price;
    });

    const sortedWeeks = Object.keys(weekData).sort();
    const sortedMonths = Object.keys(monthData).sort();

    const bookingWeekChart = {
        labels: sortedWeeks,
        datasets: [
            {
                label: 'Jumlah Booking / Minggu',
                data: sortedWeeks.map((w) => weekData[w]),
                backgroundColor: '#3B82F6',
            },
        ],
    };

    const incomeWeekChart = {
        labels: sortedWeeks,
        datasets: [
            {
                label: 'Pendapatan / Minggu ($)',
                data: sortedWeeks.map((w) => incomeWeekData[w]),
                borderColor: '#10B981',
                backgroundColor: '#6EE7B7',
                fill: true,
            },
        ],
    };

    const bookingMonthChart = {
        labels: sortedMonths,
        datasets: [
            {
                label: 'Jumlah Booking / Bulan',
                data: sortedMonths.map((m) => monthData[m]),
                backgroundColor: '#6366F1',
            },
        ],
    };

    const incomeMonthChart = {
        labels: sortedMonths,
        datasets: [
            {
                label: 'Pendapatan / Bulan ($)',
                data: sortedMonths.map((m) => incomeMonthData[m]),
                borderColor: '#F59E0B',
                backgroundColor: '#FDE68A',
                fill: true,
            },
        ],
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-4 shadow-md border">
                <h2 className="font-bold text-blue-700 mb-2">📅 Booking per Minggu</h2>
                <Bar data={bookingWeekChart} />
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md border">
                <h2 className="font-bold text-green-700 mb-2">💰 Pendapatan per Minggu</h2>
                <Line data={incomeWeekChart} />
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md border">
                <h2 className="font-bold text-indigo-700 mb-2">📆 Booking per Bulan</h2>
                <Bar data={bookingMonthChart} />
            </div>

            <div className="bg-white rounded-xl p-4 shadow-md border">
                <h2 className="font-bold text-yellow-600 mb-2">💵 Pendapatan per Bulan</h2>
                <Line data={incomeMonthChart} />
            </div>
        </div>
    );
}
