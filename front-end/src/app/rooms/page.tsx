"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import MotionSection from '../components/MotionSection';

type Room = {
    id: number;
    name: string;
    description: string;
    image_url: string;
};

function Rooms() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch("http://localhost:3001/rooms");
                const data = await response.json();
                setRooms(data);
            } catch (error) {
                console.error("Error fetching rooms:", error);
            }
        };
        fetchRooms();
    }, []);

    return (
        <section className="bg-gray-50 pt-28 pb-20 scroll-mt-28" id="rooms">
            <div className="container mx-auto px-4">
                <MotionSection direction="up">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Our Rooms</h2>
                </MotionSection>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rooms.length > 0 ? (
                        rooms.map((room) => (
                            <MotionSection key={room.id} direction="up" stagger>
                                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
                                    <div className="relative w-full h-60">
                                        <Image
                                            src={room.image_url}
                                            alt={room.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            priority
                                        />
                                    </div>
                                    <div className="p-6 text-center">
                                        <h3 className="text-2xl font-semibold text-gray-800 mb-2">{room.name}</h3>
                                        <p className="text-gray-600 line-clamp-3">{room.description}</p>
                                        <button
                                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200"
                                            onClick={() => setSelectedRoom(room)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </MotionSection>
                        ))
                    ) : (
                        <p className="text-center text-gray-600 col-span-full">Loading rooms...</p>
                    )}
                </div>

                {selectedRoom && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-4"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-8 relative">
                            {/* Close Button */}
                            <button
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
                                onClick={() => setSelectedRoom(null)}
                                aria-label="Close"
                            >
                                ✕
                            </button>

                            {/* Title */}
                            <h3 className="text-3xl font-extrabold text-center text-gray-800 mb-8 tracking-wide">
                                {selectedRoom.name}
                            </h3>

                            {/* Content Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                                {/* Image Section */}
                                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md">
                                    <Image
                                        src={selectedRoom.image_url}
                                        alt={selectedRoom.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Description Section */}
                                <div
                                    className="text-gray-700 leading-relaxed text-[17px] whitespace-pre-line max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
                                    dangerouslySetInnerHTML={{ __html: selectedRoom.description }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

            </div>
        </section>
    );
}

export default Rooms;
