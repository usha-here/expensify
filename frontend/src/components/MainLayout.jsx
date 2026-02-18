import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    CreditCard,
    PiggyBank,
    BarChart3,
    Settings,
    Plus,
    LogOut,
    Menu,
    X,
    Search,
    Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/transactions', label: 'Transactions', icon: CreditCard },
        { path: '/budgets', label: 'Budgets', icon: PiggyBank },
        { path: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
        { path: '/reports', label: 'Reports', icon: BarChart3 },
        { path: '/settings', label: 'Settings', icon: Settings },
    ];

    // If on public routes, render only outlet (Landing, Login, Register) were handled in App.jsx routing structure usually, 
    // but here we check path to be safe if MainLayout wraps everything.
    // Based on previous file, MainLayout wraps everything but conditionally renders.
    const publicRoutes = ['/', '/login', '/register'];
    if (publicRoutes.includes(location.pathname) && location.pathname !== '/dashboard') {
        return (
            <div className="font-sans text-gray-900">
                <Outlet />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#f8fafc] dark:bg-[#0f172a] overflow-hidden font-sans transition-colors duration-300">
            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#f1f5f9] dark:bg-[#0f172a] relative">
                {/* Header */}
                <header className="h-20 flex items-center justify-between px-8 bg-white/70 dark:bg-[#1e1b4b]/70 backdrop-blur-md border-b border-violet-100 dark:border-violet-900/30 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white capitalize tracking-tight font-[Outfit]">
                            {navItems.find(i => i.path === location.pathname)?.label || 'Overview'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800/50 border-none rounded-full w-64 text-sm focus:ring-2 focus:ring-violet-500/50 transition-all focus:w-80 outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400"
                            />
                        </div>
                        <button className="relative p-2.5 text-gray-500 dark:text-gray-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-600 dark:hover:text-violet-300 rounded-full transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-[#1e1b4b]"></span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>

            {/* Sidebar Desktop */}
            <aside className={`
                fixed inset-y-0 right-0 z-50 w-64 bg-white/80 dark:bg-[#1e1b4b]/80 backdrop-blur-xl border-l border-violet-100 dark:border-violet-900/30
                transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
                md:relative md:translate-x-0 flex flex-col
            `}>
                {/* Logo Area */}
                <div className="h-20 flex items-center px-8 border-b border-violet-100 dark:border-violet-900/30">
                    <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3">
                        <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-violet-500/30">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-700 to-indigo-700 dark:from-violet-400 dark:to-indigo-400 font-[Outfit]">
                            ExpensyFY
                        </span>
                    </Link>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="md:hidden ml-auto text-gray-500 hover:text-violet-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    <button
                        onClick={() => navigate('/transactions?add=true')}
                        className="w-full mb-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-500/25 rounded-xl p-3.5 flex items-center justify-center gap-2 font-medium transition-all transform hover:scale-[1.02]"
                    >
                        <Plus size={20} />
                        <span>Add New</span>
                    </button>

                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group font-medium ${isActive
                                    ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}
                            >
                                <Icon
                                    size={22}
                                    className={`transition-colors ${isActive ? 'text-violet-600 dark:text-violet-400' : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'}`}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                {item.label}
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400" />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* User Profile */}
                <div className="p-4 border-t border-violet-100 dark:border-violet-900/30 bg-gray-50/50 dark:bg-gray-900/50">
                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white dark:ring-gray-800">
                            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate group-hover:text-violet-700 dark:group-hover:text-violet-300">
                                {user?.displayName || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Pro Account</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Log Out"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile menu */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}
        </div>
    );
};

export default MainLayout;
