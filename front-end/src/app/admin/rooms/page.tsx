'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Sidebar from '../../components/admin/Sidebar'; // Pastikan path ini sesuai ya

interface Room {
    id: number;
    name: string;
    description: string;
    image_url: string;
    price: number;
}

export default function AdminRoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [editPriceId, setEditPriceId] = useState<number | null>(null);
    const [newPrice, setNewPrice] = useState<number>(0);
    const [deleteLoadingId, setDeleteLoadingId] = useState<number | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [form, setForm] = useState({ name: '', description: '', price: '' });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const router = useRouter();

    const [filterThisWeek, setFilterThisWeek] = useState(false);
    const [filterRoom, setFilterRoom] = useState('all');
    const [sortBy, setSortBy] = useState<'created_at' | 'check_in' | 'check_out'>('created_at');
    const uniqueRooms = Array.from(new Set(rooms.map((r) => r.name)));

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('adminAuth');
        if (isLoggedIn !== 'true') {
            router.push('/admin/login');
            return;
        }
        fetchRooms();
    }, [router]);

    const fetchRooms = async () => {
        try {
            const res = await fetch('http://localhost:3001/rooms');
            const data = await res.json();
            setRooms(data);
        } catch (error) {
            console.error('Gagal mengambil data kamar:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin ingin menghapus kamar ini?')) return;
        setDeleteLoadingId(id);
        try {
            await fetch(`http://localhost:3001/rooms/${id}`, { method: 'DELETE' });
            setRooms((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            console.error('Gagal hapus kamar:', err);
        } finally {
            setDeleteLoadingId(null);
        }
    };

    const handleEdit = (room: Room) => {
        setEditPriceId(room.id);
        setNewPrice(room.price);
    };

    const handleSave = async (id: number) => {
        try {
            await fetch(`http://localhost:3001/rooms/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ price: newPrice }),
            });
            setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, price: newPrice } : r)));
            setEditPriceId(null);
        } catch (err) {
            console.error('Gagal update harga:', err);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setImageFile(file);
    };

    const handleAddRoom = async () => {
        const { name, description, price } = form;
        if (!name || !description || !price || !imageFile) {
            alert('Semua kolom harus diisi!');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('image', imageFile);

        try {
            const res = await fetch('http://localhost:3001/rooms/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            console.log('Berhasil upload:', data);

            await fetchRooms();
            setForm({ name: '', description: '', price: '' });
            setImageFile(null);
            setShowAddModal(false);
        } catch (err) {
            console.error('Gagal menambahkan kamar:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
        );
    }

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
            /> {/* 👈 Sidebar ditampilkan di sisi kiri */}
            <main className="flex-1 p-6">
                <h1 className="text-4xl font-bold mb-6 text-blue-800">🛏️ Manage Rooms</h1>
                <div className="flex justify-end mb-6">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md transition"
                    >
                        ➕ Tambah Kamar
                    </button>
                </div>

                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl w-full max-w-xl p-6 shadow-lg animate-fade-in">
                            <h2 className="text-2xl font-semibold text-blue-700 mb-4">Tambah Kamar</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" name="name" value={form.name} onChange={handleInputChange} placeholder="Nama Kamar" className="border p-2 rounded col-span-2" />
                                <input type="number" name="price" value={form.price} onChange={handleInputChange} placeholder="Harga" className="border p-2 rounded col-span-2" />
                                <textarea name="description" value={form.description} onChange={handleInputChange} placeholder="Deskripsi" className="border p-2 rounded col-span-2" />
                                <input type="file" accept="image/*" onChange={handleFileChange} className="col-span-2" />
                            </div>
                            <div className="mt-4 flex justify-end gap-2">
                                <button onClick={handleAddRoom} className="bg-green-600 text-white px-4 py-2 rounded">Simpan</button>
                                <button onClick={() => setShowAddModal(false)} className="text-gray-600 hover:underline">Batal</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <div key={room.id} className="bg-white border rounded-xl shadow-lg overflow-hidden">
                            <div className="relative w-full h-52">
                                <Image src={room.image_url} alt={room.name} layout="fill" objectFit="cover" />
                            </div>
                            <div className="p-4">
                                <h2 className="font-bold text-lg">{room.name}</h2>
                                <p className="text-sm text-gray-600 line-clamp-2">{room.description}</p>
                                {editPriceId === room.id ? (
                                    <div className="flex items-center gap-2 mt-2">
                                        <input
                                            type="number"
                                            value={isNaN(newPrice) ? '' : newPrice}
                                            onChange={(e) => setNewPrice(parseInt(e.target.value))}
                                            className="border px-2 py-1 w-24"
                                        />
                                        <button onClick={() => handleSave(room.id)} className="bg-green-600 text-white text-sm px-3 py-1 rounded">
                                            💾 Simpan
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-blue-600 font-bold mt-2">
                                        Rp{(room.price ?? 0).toLocaleString()}
                                    </p>
                                )}
                                <div className="flex gap-2 mt-2">
                                    {editPriceId !== room.id && (
                                        <button onClick={() => handleEdit(room)} className="text-sm bg-yellow-400 text-white px-3 py-1 rounded">✏️ Edit</button>
                                    )}
                                    <button onClick={() => handleDelete(room.id)} disabled={deleteLoadingId === room.id} className="text-sm bg-red-600 text-white px-3 py-1 rounded">
                                        {deleteLoadingId === room.id ? 'Menghapus...' : '🗑️ Delete'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
