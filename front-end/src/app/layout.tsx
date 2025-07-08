'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './globals.css';
import { usePathname } from 'next/navigation'; /// 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname(); ////
  const hideFooter = pathname === '/admin/login';

  useEffect(() => {
    const updateLoginState = () => {
      const loggedIn = localStorage.getItem('adminAuth') === 'true';
      setIsAdminLoggedIn(loggedIn);
    };

    updateLoginState();

    // Sync state if localStorage changes from other tabs
    const onStorageChange = () => updateLoginState();
    window.addEventListener('storage', onStorageChange);

    // Close dropdown if click outside
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('storage', onStorageChange);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    window.dispatchEvent(new Event('storage')); // force update all tabs
    setIsAdminLoggedIn(false);
    setDropdownOpen(false);
    router.push('/');
  };

  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {/* === NAVBAR === */}
        <header className="bg-biru shadow-lg fixed w-full z-50 h-16">
          <div className="container mx-auto px-4 flex items-center justify-between h-full">
            <div className="text-2xl font-bold text-white">SIGMA HOTEL</div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center space-x-4 text-sm">
              <Link href="/" className="text-white hover:text-blue-200">Home</Link>
              <Link href="/rooms" className="text-white hover:text-blue-200">Rooms</Link>
              <Link href="/facilities" className="text-white hover:text-blue-200">Facilities</Link>
              <Link href="/about" className="text-white hover:text-blue-200">About Us</Link>
              <Link href="/book" className="bg-birumuda text-white py-1.5 px-3 rounded hover:bg-blue-700 transition">
                🛏️ Book
              </Link>

              {!isAdminLoggedIn ? (
                <Link
                  href="/admin/login"
                  className="text-white border border-white py-1.5 px-3 rounded hover:bg-white hover:text-blue-700 transition"
                >
                  🔐 Admin Login
                </Link>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="text-white py-1.5 px-3 border border-white rounded hover:bg-white hover:text-blue-700 transition"
                  >
                    👤
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50">
                      <Link
                        href="/admin/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
                  viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <nav className="md:hidden bg-white shadow-lg absolute top-full left-0 w-full z-40">
              <ul className="flex flex-col p-4 space-y-4">
                <li><Link href="/" onClick={closeMenu} className="text-gray-700 hover:text-blue-600">Home</Link></li>
                <li><Link href="/rooms" onClick={closeMenu} className="text-gray-700 hover:text-blue-600">Rooms</Link></li>
                <li><Link href="/facilities" onClick={closeMenu} className="text-gray-700 hover:text-blue-600">Facilities</Link></li>
                <li><Link href="/about" onClick={closeMenu} className="text-gray-700 hover:text-blue-600">About Us</Link></li>
                <li>
                  <Link href="/book" onClick={closeMenu}
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-center">
                    🛏️ Book
                  </Link>
                </li>
                <li>
                  {!isAdminLoggedIn ? (
                    <Link href="/admin/login" onClick={closeMenu}
                      className="border border-blue-600 text-blue-600 py-2 px-4 rounded hover:bg-blue-600 hover:text-white text-center">
                      🔐 Admin Login
                    </Link>
                  ) : (
                    <>
                      <Link href="/admin/dashboard" onClick={closeMenu}
                        className="text-blue-600 py-2 px-4 rounded hover:bg-gray-100 text-center">
                        👤 Dashboard
                      </Link>
                      <button
                        onClick={() => { handleLogout(); closeMenu(); }}
                        className="border border-red-600 text-red-600 py-2 px-4 rounded hover:bg-red-600 hover:text-white text-center w-full"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </li>
              </ul>
            </nav>
          )}
        </header>

        {/* === MAIN CONTENT === */}
        <main className="pt-16">{children}</main>

        {/* === FOOTER === */}
        {!hideFooter && (
          <footer className="bg-biru text-gray-200 mt-12">
            <div className="container mx-auto px-4 py-8 text-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">About Us</h3>
                  <p className="text-sm text-gray-400">SIGMA Hotel is a luxurious destination offering top-notch comfort and service.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li>Email: info@schotel.com</li>
                    <li>Phone: +123 456 789</li>
                    <li>Address: 123 Hotel St, City, Country</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li><Link href="/rooms" className="hover:text-blue-600">Rooms</Link></li>
                    <li><Link href="/facilities" className="hover:text-blue-600">Facilities</Link></li>
                    <li><Link href="/about" className="hover:text-blue-600">About Us</Link></li>
                    <li><Link href="/contact" className="hover:text-blue-600">Contact</Link></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400">
                &copy; 2024 SIGMA Hotel. All rights reserved.
              </div>
            </div>
          </footer>
        )}

      </body>
    </html>
  );
}
