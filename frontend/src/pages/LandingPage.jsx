import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, CreditCard, PieChart, Shield, Smartphone, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';

const LandingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-gray-900 dark:text-white font-sans overflow-hidden transition-colors duration-300 relative">

            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-violet-400/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
                <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-400/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-fuchsia-400/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000"></div>
            </div>

            {/* Navigation */}
            <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-20">
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
                <div className="flex items-center gap-4">
                    <Link to="/login">
                        <Button variant="ghost">Log In</Button>
                    </Link>
                    <Link to="/register">
                        <Button variant="primary">Get Started</Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="container mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center relative z-10">
                <div className="md:w-1/2 mb-12 md:mb-0">
                    <div className="inline-flex items-center gap-2 bg-white/50 dark:bg-white/5 backdrop-blur-md border border-violet-200 dark:border-white/10 rounded-full px-4 py-1.5 mb-8 shadow-sm">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-500"></span>
                        </span>
                        <span className="text-violet-700 dark:text-violet-300 text-xs font-semibold uppercase tracking-wider">v2.0 Now Available</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6 tracking-tight">
                        Master your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-600 animate-gradient-x">
                            finances today.
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg leading-relaxed">
                        Experience the next generation of expense tracking. Beautiful, intuitive, and designed to help you save more.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link to="/register">
                            <Button size="lg" className="w-full sm:w-auto shadow-xl shadow-violet-500/20">
                                Start Dashboard <ArrowRight size={20} className="ml-2" />
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                                View Demo
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-10 flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 font-medium">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-violet-500" />
                            <span>Free for personal use</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-violet-500" />
                            <span>No credit card required</span>
                        </div>
                    </div>
                </div>

                {/* Dashboard Preview / Abstract Visual */}
                <div className="md:w-1/2 relative perspective-1000">
                    <div className="relative transform rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-all duration-700 ease-out">
                        {/* Card Reflection/Glow */}
                        <div className="absolute inset-0 bg-violet-500/30 blur-[60px] rounded-3xl -z-10 transform translate-y-10"></div>

                        <div className="bg-white/80 dark:bg-[#1e1b4b]/80 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-2xl p-6 shadow-2xl dark:shadow-black/50">
                            {/* Mock Header */}
                            <div className="flex items-center justify-between mb-8 border-b border-gray-100 dark:border-white/5 pb-4">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <div className="h-2 w-20 bg-gray-200 dark:bg-white/10 rounded-full"></div>
                            </div>

                            {/* Mock Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-violet-50 dark:bg-white/5 p-4 rounded-xl border border-violet-100 dark:border-white/5">
                                    <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 font-medium">Total Balance</div>
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">₹1,24,500</div>
                                </div>
                                <div className="bg-fuchsia-50 dark:bg-white/5 p-4 rounded-xl border border-fuchsia-100 dark:border-white/5">
                                    <div className="text-gray-500 dark:text-gray-400 text-xs mb-1 font-medium">Monthly Spent</div>
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">₹12,400</div>
                                </div>
                            </div>

                            {/* Mock List */}
                            <div className="space-y-3">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-black/20 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${i === 0 ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'}`}>
                                                <CreditCard size={18} />
                                            </div>
                                            <div>
                                                <div className="h-2 w-24 bg-gray-200 dark:bg-white/10 rounded-full mb-1.5"></div>
                                                <div className="h-1.5 w-16 bg-gray-100 dark:bg-white/5 rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="h-2 w-12 bg-gray-200 dark:bg-white/10 rounded-full"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="container mx-auto px-6 py-24 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<LayoutDashboard className="text-violet-600 dark:text-violet-400" />}
                        title="Comprehensive Dashboard"
                        description="Get a bird's eye view of your finances with our intuitive, consolidated dashboard layout."
                        delay="0"
                    />
                    <FeatureCard
                        icon={<PieChart className="text-fuchsia-600 dark:text-fuchsia-400" />}
                        title="Detailed Analytics"
                        description="Visualize spending patterns with interactive charts that match the dashboard's precision."
                        delay="100"
                    />
                    <FeatureCard
                        icon={<Smartphone className="text-indigo-600 dark:text-indigo-400" />}
                        title="Seamless Sync"
                        description="Access your dashboard from any device. Your financial data is always at your fingertips."
                        delay="200"
                    />
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, delay }) => (
    <div
        className="bg-white/60 dark:bg-[#1e1b4b]/40 backdrop-blur-xl p-8 rounded-2xl border border-white/50 dark:border-white/5 shadow-xl shadow-gray-200/50 dark:shadow-black/20 hover:-translate-y-2 transition-transform duration-300 group"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="w-14 h-14 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 group-hover:shadow-violet-500/20 border border-gray-100 dark:border-white/10">
            {React.cloneElement(icon, { size: 28 })}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
            {description}
        </p>
    </div>
);

export default LandingPage;
