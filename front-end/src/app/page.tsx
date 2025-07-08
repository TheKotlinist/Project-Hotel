'use client';

import Image from 'next/image';
import Link from 'next/link';
import Carousel from './Carousel';
import MotionSection from './components/MotionSection';
import { motion } from 'framer-motion';

const LandingPage = () => {
    return (
        <section className="bg-white min-h-screen space-y-48">

            {/* HERO */}
            <div
                className="relative h-screen bg-cover bg-center"
                style={{ backgroundImage: 'url("https://www.bluestarhotel.com/photoswipe/photos/large/2.webp")' }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center px-6">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="text-6xl font-extrabold text-white uppercase mb-6 drop-shadow-xl"
                    >
                        WELCOME TO LUXURY STAY
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                        className="text-xl text-gray-200 font-semibold mb-8 max-w-2xl"
                    >
                        Your perfect vacation awaits. Experience the best comfort and amenities at our hotel.
                    </motion.p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 px-8 rounded-xl text-lg font-bold uppercase tracking-wide shadow-xl hover:shadow-2xl focus:outline-none"
                    >
                        BOOK NOW
                    </motion.button>
                </div>
            </div>

            {/* GALLERY */}
            <div className="container mx-auto px-6 text-center">
                <MotionSection direction="up">
                    <h2 className="text-5xl font-extrabold text-gray-900 uppercase mb-20 relative inline-block after:content-[''] after:absolute after:-bottom-3 after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-1 after:bg-blue-500 after:rounded-full">
                        GALLERY
                    </h2>
                </MotionSection>
                <MotionSection direction="up">
                    <Carousel />
                </MotionSection>
            </div>

            {/* SERVICES */}
            <section className="bg-white mb-24">
                <div className="container mx-auto px-6 text-center">
                    <MotionSection direction="up">
                        <h2 className="text-5xl font-extrabold text-gray-900 uppercase mb-20 relative inline-block after:content-[''] after:absolute after:-bottom-3 after:left-1/2 after:-translate-x-1/2 after:w-28 after:h-1 after:bg-blue-500 after:rounded-full">
                            OUR SERVICES
                        </h2>
                    </MotionSection>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[
                            {
                                img: '/images/spa1.jpg',
                                title: 'RELAXING SPA',
                                desc: 'Pamper yourself with our luxurious spa treatments to unwind and recharge.',
                            },
                            {
                                img: '/images/restaurant.jpg',
                                title: 'FINE DINING',
                                desc: 'Indulge in gourmet meals prepared by world-class chefs in a beautiful setting.',
                            },
                            {
                                img: '/images/infinitypool.jpg',
                                title: 'INFINITY POOL',
                                desc: 'Take a dip in our rooftop infinity pool while enjoying panoramic city views.',
                            },
                        ].map((service, i) => (
                            <MotionSection key={i} direction="up">
                                <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-2xl hover:scale-[1.03] transition-all duration-300">
                                    <Image src={service.img} alt={service.title} width={340} height={220} className="rounded-md mb-6 object-cover" />
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3 uppercase">{service.title}</h3>
                                    <p className="text-gray-600 font-medium text-center">{service.desc}</p>
                                </div>
                            </MotionSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="py-20 bg-gradient-to-br from-blue-800 via-blue-700 to-purple-900 text-white">
                <div className="container mx-auto px-6 text-center">
                    <MotionSection direction="up">
                        <h2 className="text-5xl font-extrabold uppercase mb-20 relative inline-block after:content-[''] after:absolute after:-bottom-3 after:left-1/2 after:-translate-x-1/2 after:w-28 after:h-1 after:bg-white after:rounded-full">
                            WHAT OUR GUESTS SAY
                        </h2>
                    </MotionSection>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[
                            { text: "Amazing view and very helpful staff!", author: "EMILY ROSS", stars: "★★★★★" },
                            { text: "I loved the rooftop pool and elegant room decor.", author: "MICHAEL SCOTT", stars: "★★★★★" },
                            { text: "Perfect place for a weekend getaway.", author: "SARAH CONNOR", stars: "★★★★☆" },
                            { text: "Everything was top notch! Highly recommended.", author: "BRIAN KENT", stars: "★★★★★" },
                            { text: "The food was exquisite and service outstanding.", author: "KATE LANE", stars: "★★★★★" },
                            { text: "Very clean, modern, and peaceful location.", author: "DAVID TRAN", stars: "★★★★★" },
                            { text: "I will definitely come back again!", author: "LINDA MOORE", stars: "★★★★★" },
                            { text: "Unforgettable stay, especially the spa!", author: "KEVIN JAMES", stars: "★★★★☆" },
                            { text: "Fantastic hospitality and facilities!", author: "ALICIA WONG", stars: "★★★★★" },
                        ].map((t, i) => (
                            <MotionSection key={i} direction="up">
                                <div className="bg-white/10 backdrop-blur p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all h-full flex flex-col justify-between">
                                    <p className="italic mb-4">&quot;{t.text}&quot;</p>
                                    <h3 className="text-lg font-bold uppercase">- {t.author}</h3>
                                    <div className="text-yellow-400 mt-2 text-xl">{t.stars}</div>
                                </div>
                            </MotionSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <MotionSection direction="up">
                <section className="bg-white py-32 text-center text-black">
                    <h2 className="text-5xl font-extrabold uppercase mb-8 relative inline-block after:content-[''] after:absolute after:-bottom-3 after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-1 after:bg-blue-500 after:rounded-full">
                        READY TO BOOK YOUR STAY?
                    </h2>
                    <p className="text-xl mb-6 font-semibold uppercase text-gray-700 max-w-2xl mx-auto">
                        Enjoy world-class amenities and make unforgettable memories with us.
                    </p>
                    <Link
                        href="/book"
                        className="bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold text-lg px-8 py-4 rounded-xl hover:opacity-90 transition uppercase shadow-lg hover:shadow-xl"
                    >
                        RESERVE NOW
                    </Link>
                </section>
            </MotionSection>

            {/* FOOTER SPACER */}
            <div className="h-100"></div>
        </section>
    );
};

export default LandingPage;
