'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import MotionSection from '../components/MotionSection';

type Facility = {
    id: number;
    name: string;
    description: string;
    image: string;
};

function Facilities() {
    const [facilities, setFacilities] = useState<Facility[]>([]);

    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                const response = await fetch("http://localhost:3001/api/facilities");
                const data = await response.json();
                setFacilities(data.facilities);
            } catch (error) {
                console.error("Error fetching facilities:", error);
            }
        };
        fetchFacilities();
    }, []);

    return (
        <section className="bg-gray-50 pt-28 pb-20 scroll-mt-28" id="facilities">
            <div className="container mx-auto px-4">
                <MotionSection direction="up">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
                        Our Facilities
                    </h2>
                </MotionSection>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {facilities.length > 0 ? (
                        facilities.map((facility) => (
                            <MotionSection key={facility.id} direction="up" stagger>
                                <div
                                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
                                    style={{ minHeight: '400px' }} // supaya kotak sama tinggi
                                >
                                    <div className="relative w-full h-60">
                                        <Image
                                            src={facility.image}
                                            alt={facility.name}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            priority
                                        />
                                    </div>
                                    <div className="p-6 text-center">
                                        <h3 className="text-2xl font-semibold text-gray-800 mb-2">{facility.name}</h3>
                                        <p className="text-gray-600 line-clamp-3">{facility.description}</p>
                                    </div>
                                </div>
                            </MotionSection>
                        ))
                    ) : (
                        <p className="text-center text-gray-600 col-span-full">
                            Loading facilities...
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}

export default Facilities;
