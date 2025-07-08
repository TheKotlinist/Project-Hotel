'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image'; // ✅ Import Image dari Next.js

const images = [
    '/images/fasilitas1.jpg',
    '/images/fasilitas2.jpg',
    '/images/fasilitas3.jpg',
    '/images/fasilitas1.jpg',
    '/images/fasilitas2.jpg',
];

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    return (
        <div className="relative w-full">
            {/* Carousel Wrapper */}
            <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-700 ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <Image
                            src={image}
                            alt={`Slide ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="100vw"
                            priority={index === 0} // Prioritaskan gambar pertama
                        />
                    </div>
                ))}
            </div>

            {/* Slider Controls */}
            <button
                onClick={goToPrevious}
                className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white">
                    <svg
                        className="w-4 h-4 text-black"
                        fill="none"
                        viewBox="0 0 6 10"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M5 1L1 5l4 4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
            </button>
            <button
                onClick={goToNext}
                className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white">
                    <svg
                        className="w-4 h-4 text-black"
                        fill="none"
                        viewBox="0 0 6 10"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M1 9l4-4-4-4"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
            </button>
        </div>
    );
};

export default Carousel;
