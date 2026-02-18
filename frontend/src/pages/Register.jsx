import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Register = () => {
    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const { register, user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await register(formData.displayName, formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute bottom-[20%] left-[10%] w-[50%] h-[50%] rounded-full bg-violet-400/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
                <div className="absolute top-[20%] right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-400/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <Link to={user ? "/dashboard" : "/"} className="inline-flex items-center gap-2 mb-6">
                        <div className="bg-gradient-to-tr from-violet-600 to-indigo-600 p-2 rounded-lg shadow-lg shadow-violet-500/20">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-700 to-indigo-700 dark:from-violet-400 dark:to-indigo-400 font-[Outfit]">
                            ExpensyFY
                        </span>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
                    <p className="text-gray-500 dark:text-gray-400">Start your journey to financial freedom.</p>
                </div>

                <Card className="p-8">
                    {error && (
                        <div className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 text-sm p-3 rounded-xl mb-6 text-center border border-red-100 dark:border-red-900/30">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            label="Full Name"
                            name="displayName"
                            type="text"
                            icon={User}
                            value={formData.displayName}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                        />

                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            icon={Mail}
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                        />

                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            icon={Lock}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />

                        <div className="pt-2">
                            <Button
                                type="submit"
                                className="w-full shadow-xl shadow-violet-500/20"
                                size="lg"
                                isLoading={isLoading}
                            >
                                Create Account <ArrowRight size={18} className="ml-2" />
                            </Button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-violet-600 hover:text-violet-500 dark:text-violet-400 font-bold hover:underline">
                            Login here
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Register;
