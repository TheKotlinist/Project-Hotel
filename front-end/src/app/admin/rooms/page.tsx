'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Room {
    id: number;
    name: string;
    description: string;
    image_url: string;
    price: number;
}

export default function AdminRoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await fetch('http://localhost:3001/rooms');
                const data = await res.json();
                setRooms(data);
            } catch (error) {
                console.error('Gagal mengambil data kamar:', error);
            }
        };
        fetchRooms();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6 text-blue-700">🛏️ Manage Rooms</h1>

            {rooms.length === 0 ? (
                <p className="text-gray-600 italic">Tidak ada data kamar ditemukan.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            className="bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
                        >
                            <div className="relative w-full h-48">
                                <Image
                                    src={room.image_url}
                                    alt={room.name}
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-1">{room.name}</h2>
                                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{room.description}</p>
                                <p className="text-blue-600 font-bold mb-4">
                                    ${room.price.toLocaleString()} / night
                                </p>
                                <div className="flex gap-2">
                                    <button className="bg-yellow-500 text-white text-sm px-3 py-1 rounded hover:bg-yellow-600 transition">
                                        ✏️ Edit
                                    </button>
                                    <button className="bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700 transition">
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
