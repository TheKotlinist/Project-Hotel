'use client';

import Image from 'next/image';
import MotionSection from '../components/MotionSection';

const AboutUs = () => {
    return (
        <section className="bg-gray-50 pt-28 pb-20 scroll-mt-28" id="about">
            <div className="container mx-auto px-4">

                {/* === Judul Section === */}
                <MotionSection direction="up">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">About Us</h2>
                </MotionSection>

                {/* === Deskripsi dan Gambar Hotel === */}
                <div className="grid md:grid-cols-2 gap-10 bg-slate-500 rounded-2xl shadow-lg p-8">
                    <MotionSection direction="left">
                        <div className="text-white flex flex-col justify-center">
                            <h3 className="text-3xl font-semibold mb-4">Welcome to SIGMA Hotel</h3>
                            <p className="mb-4">
                                SIGMA Hotel is a luxurious haven where comfort meets elegance. Our dedicated staff is here to ensure your stay is
                                nothing short of extraordinary.
                            </p>
                            <p>
                                Whether visiting for business or leisure, SIGMA Hotel offers a variety of accommodations, fine dining, and
                                relaxing spaces to unwind.
                            </p>
                        </div>
                    </MotionSection>

                    <MotionSection direction="right">
                        <div className="flex justify-center items-center">
                            <div className="rounded-xl overflow-hidden shadow-xl w-full h-64 md:h-80 relative">
                                <Image
                                    src="/images/hero.jpg"
                                    alt="SIGMA Hotel"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>
                    </MotionSection>
                </div>

                {/* === Visi & Misi === */}
                <div className="grid md:grid-cols-2 gap-8 mt-16">
                    <MotionSection direction="up" stagger>
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Vision</h3>
                            <p className="text-gray-600">
                                To be the leading hotel in the region known for exceptional service and hospitality.
                            </p>
                        </div>
                    </MotionSection>
                    <MotionSection direction="up" stagger>
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h3>
                            <p className="text-gray-600">
                                To provide our guests with outstanding service and the highest quality accommodations to create memorable
                                experiences.
                            </p>
                        </div>
                    </MotionSection>
                </div>

                {/* === Meet Our Team === */}
                <div className="mt-20">
                    <MotionSection direction="up">
                        <h3 className="text-3xl font-semibold text-center text-gray-800 mb-10">Meet Our Team</h3>
                    </MotionSection>

                    {/* Baris 1 - 3 orang */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center mb-10">
                        {[
                            { name: 'Hagi Salman Alfarizi', role: '50423557' },
                            { name: 'Mikhael Adicahya Kurniawan', role: '50423774' },
                            { name: 'Muhammad Raddya Fakhreza Muhammad', role: '50423970' },
                        ].map((member, index) => (
                            <MotionSection key={index} direction="up" stagger>
                                <div className="bg-white rounded-2xl shadow-md p-6 w-full h-full min-h-[340px] text-center flex flex-col justify-between items-center">
                                    <Image
                                        src="/images/image2.png"
                                        alt={member.name}
                                        width={200}
                                        height={200}
                                        className="rounded-full mb-4 object-cover aspect-square"
                                    />
                                    <div>
                                        <h4 className="text-xl font-semibold text-gray-800">{member.name}</h4>
                                        <p className="text-gray-600">{member.role}</p>
                                    </div>
                                </div>
                            </MotionSection>
                        ))}
                    </div>

                    {/* Baris 2 - 4 orang */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-center">
                        {[
                            { name: 'Muhammad Rizqy Pangeran Winarko', role: '51423012' },
                            { name: 'Ray Siraj', role: '51423248' },
                            { name: 'Zaky Muhammad Sabakhtasyi', role: '51423497' },
                            { name: 'Zulaikha Indria Desfiany', role: '51423509' },
                        ].map((member, index) => (
                            <MotionSection key={index} direction="up" stagger>
                                <div className="bg-white rounded-2xl shadow-md p-6 w-full h-full min-h-[340px] text-center flex flex-col justify-between items-center">
                                    <Image
                                        src="/images/image2.png"
                                        alt={member.name}
                                        width={200}
                                        height={200}
                                        className="rounded-full mb-4 object-cover aspect-square"
                                    />
                                    <div>
                                        <h4 className="text-xl font-semibold text-gray-800">{member.name}</h4>
                                        <p className="text-gray-600">{member.role}</p>
                                    </div>
                                </div>
                            </MotionSection>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default AboutUs;
