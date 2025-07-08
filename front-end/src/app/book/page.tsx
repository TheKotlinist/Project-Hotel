"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import emailjs from 'emailjs-com';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';
import MotionSection from '../components/MotionSection';

const rooms = [
    {
        id: 'single',
        name: 'Single Room',
        price: 100,
        description: 'A cozy room for one, with all essential amenities.',
        image: 'https://www.satoriahotel.com/wp-content/uploads/2022/04/E.-Deluxe-Room-1-scaled-e1651111459463.jpg',
    },
    {
        id: 'double',
        name: 'Double Room',
        price: 150,
        description: 'Perfect for couples or friends, offering a comfortable stay.',
        image: 'https://www.momondo.com/himg/36/eb/50/expedia_group-356495-5dcc1200-828991.jpg',
    },
    {
        id: 'suite',
        name: 'Suite',
        price: 250,
        description: 'Luxurious suite with extra space and premium amenities.',
        image: 'https://s2.bukalapak.com/bukalapak-kontenz-production/content_attachments/75007/original/66013532_s.jpg',
    },
];

export default function BookingPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [guests, setGuests] = useState(1);
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [roomType, setRoomType] = useState('single');
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalNights, setTotalNights] = useState(0);
    const [isQRVisible, setIsQRVisible] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const diff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(diff / (1000 * 3600 * 24));

        if (nights > 0) {
            const room = rooms.find((r) => r.id === roomType);
            const price = room?.price || 0;
            setTotalNights(nights);
            setTotalPrice(nights * price);
        } else {
            setTotalNights(0);
            setTotalPrice(0);
        }
    }, [checkInDate, checkOutDate, roomType]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (totalPrice <= 0) return alert('Tanggal check-in dan check-out tidak valid.');

        try {
            await fetch('http://localhost:3001/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    guests,
                    room_id: roomType === 'single' ? 1 : roomType === 'double' ? 2 : 3,
                    check_in: checkInDate,
                    check_out: checkOutDate,
                }),
            });

            setIsQRVisible(true);
        } catch (error) {
            console.error(error);
            alert('Booking gagal. Coba lagi ya!');
        }
    };

    const handleConfirmPayment = () => {
        setIsSending(true);
        const templateParams = {
            user_name: name,
            user_email: email,
            room_type: rooms.find((r) => r.id === roomType)?.name || '',
            check_in: checkInDate,
            check_out: checkOutDate,
            total_nights: totalNights,
            guests,
            total_price: totalPrice,
        };

        emailjs.send(
            'service_alrynls',
            'template_p3ibpub',
            templateParams,
            'rciog2YI_QB8GYZVZ'
        ).then(() => {
            setIsQRVisible(false);
            setIsConfirmed(true);
        }).catch((error) => {
            console.error('EmailJS Error:', error);
            alert('Gagal mengirim email konfirmasi.');
        }).finally(() => {
            setIsSending(false);
        });
    };

    const qrContent = `booking://${name}-${roomType}-${checkInDate}-${checkOutDate}-${guests}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrContent)}`;

    return (
        <section className="bg-white pt-28 pb-20 scroll-mt-28 min-h-screen">
            <div className="container mx-auto px-4">
                <MotionSection direction="up">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Book Your Stay</h2>
                </MotionSection>

                <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-20">
                    {rooms.map((room) => (
                        <MotionSection key={room.id} direction="up" stagger>
                            <div
                                className={`border rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${roomType === room.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'}`}
                            >
                                <div className="relative w-full h-60">
                                    <Image src={room.image} alt={room.name} fill className="object-cover" />
                                </div>
                                <div className="p-6 text-center">
                                    <h3 className="text-2xl font-semibold mb-2">{room.name}</h3>
                                    <p className="text-gray-600 text-sm mb-2">{room.description}</p>
                                    <p className="text-blue-700 font-bold text-lg mb-4">${room.price} / night</p>
                                    <button
                                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                                        onClick={() => setRoomType(room.id)}
                                    >
                                        Select
                                    </button>
                                </div>
                            </div>
                        </MotionSection>
                    ))}
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="max-w-2xl mx-auto bg-gray-100 p-10 rounded-2xl shadow-xl space-y-6"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input type="text" value={name} required onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 rounded-lg border" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input type="email" value={email} required onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 rounded-lg border" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Guests</label>
                            <input type="number" min={1} value={guests} onChange={(e) => setGuests(parseInt(e.target.value))} className="w-full px-4 py-2 rounded-lg border" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Check-In</label>
                            <input type="date" value={checkInDate} required onChange={(e) => setCheckInDate(e.target.value)} className="w-full px-4 py-2 rounded-lg border" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Check-Out</label>
                            <input type="date" value={checkOutDate} required onChange={(e) => setCheckOutDate(e.target.value)} className="w-full px-4 py-2 rounded-lg border" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Total Nights</label>
                            <input type="text" readOnly value={`${totalNights} night(s)`} className="w-full px-4 py-2 rounded-lg border bg-gray-200 text-gray-600 cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Total Price</label>
                            <input type="text" readOnly value={`$${totalPrice}`} className="w-full px-4 py-2 rounded-lg border bg-gray-200 text-gray-700 cursor-not-allowed" />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white text-lg font-bold py-3 rounded-lg hover:bg-blue-700 transition">
                        Book Now
                    </button>
                </form>

                {/* QR MODAL */}
                <AnimatePresence>
                    {isQRVisible && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center"
                            >
                                <h3 className="text-xl font-semibold mb-4">Bayar dengan QRIS</h3>
                                <a href={qrUrl} target="_blank" rel="noopener noreferrer">
                                    <img src={qrUrl} alt="QR Code" width={200} height={200} className="mx-auto" />
                                    <p className="text-sm text-blue-600 underline mt-2">Klik untuk buka QR</p>
                                </a>

                                {isSending ? (
                                    <>
                                        <LoadingSpinner />
                                        <p className="mt-2 text-sm text-gray-500">Mengirim konfirmasi email...</p>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleConfirmPayment}
                                        className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                    >
                                        Saya sudah bayar
                                    </button>
                                )}


                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* SUCCESS MODAL */}
                <AnimatePresence>
                    {isConfirmed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        >
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 50, opacity: 0 }}
                                className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full text-center"
                            >
                                <h3 className="text-xl font-bold text-green-700 mb-4">Booking Sukses!</h3>
                                <p className="text-gray-700">
                                    Terima kasih, {name}! Booking Anda untuk kamar <strong>{rooms.find((r) => r.id === roomType)?.name}</strong> dari{' '}
                                    <strong>{checkInDate}</strong> sampai <strong>{checkOutDate}</strong> ({totalNights} malam) untuk {guests} tamu telah dikonfirmasi.
                                </p>
                                <button onClick={() => setIsConfirmed(false)} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                    Tutup
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </section>
    );
}
