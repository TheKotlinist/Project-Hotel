'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';

export default function AdminLogin() {
    const router = useRouter();
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('adminAuth') === 'true') {
                router.push('/admin/dashboard');
            }
        }
    }, [router]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (id === 'admin' && password === 'admin') {
            localStorage.setItem('adminAuth', 'true');
            window.location.href = '/admin/dashboard';
        } else {
            setError('❌ ID atau password salah.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-white to-blue-400 px-4"
        >
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white shadow-2xl border border-gray-200 rounded-3xl p-10 w-full max-w-md"
            >
                <h2 className="text-3xl font-bold text-center text-blue-800 mb-8 font-poppins">🔐 Admin Login</h2>

                <form onSubmit={handleLogin} className="space-y-6">
                    <InputWithIcon
                        icon={<UserIcon className="w-5 h-5 text-gray-400" />}
                        placeholder="Admin ID"
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                    <InputWithIcon
                        icon={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-600 text-sm text-center"
                        >
                            {error}
                        </motion.p>
                    )}

                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        whileHover={{ scale: 1.02 }}
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md"
                    >
                        Login
                    </motion.button>
                </form>
            </motion.div>
        </motion.div>
    );
}

function InputWithIcon({
    icon,
    placeholder,
    value,
    onChange,
    type = 'text',
}: {
    icon: React.ReactNode;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}) {
    return (
        <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                {icon}
            </div>
            <input
                type={type}
                value={value}
                onChange={onChange}
                required
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-400"
            />
        </div>
    );
}
