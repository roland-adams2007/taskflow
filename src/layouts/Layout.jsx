import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const Layout = () => {
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    const toggleMobileNav = () => {
        setIsMobileNavOpen(!isMobileNavOpen);
    };

    return (
        <div className="flex min-h-screen relative">
            <Sidebar isOpen={isMobileNavOpen} onClose={toggleMobileNav} />
            <main className="w-full flex-1 ml-0 lg:ml-72 p-6 bg-gray-100 text-slate-900 transition-all">
                {!isMobileNavOpen && (
                    <button
                        className="lg:hidden fixed top-4 left-4 z-50 bg-white border border-gray-200 rounded-lg w-10 h-10 flex items-center justify-center shadow-sm hover:bg-gray-50"
                        onClick={toggleMobileNav}
                    >
                        <Menu className="w-6 h-6 text-slate-700" />
                    </button>
                )}

                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
