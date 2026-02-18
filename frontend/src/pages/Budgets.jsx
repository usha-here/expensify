import React, { useState, useEffect } from 'react';
import { getBudgets, getExpenses, createBudget, deleteBudget } from '../api/client';
import { Plus, Trash2, X, Wallet, TrendingUp, AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Budgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // New Budget State
    const [newBudget, setNewBudget] = useState({
        category: '',
        limit: '',
        color: 'bg-violet-500'
    });

    const categories = ['Food & Dining', 'Transport', 'Utilities', 'Shopping', 'Entertainment', 'Health', 'Create Custom'];
    // Palette adapted for the new theme
    const colors = ['bg-violet-500', 'bg-indigo-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500', 'bg-orange-500', 'bg-emerald-500'];

    const fetchData = async () => {
        try {
            const [bRes, eRes] = await Promise.all([getBudgets(), getExpenses()]);
            setBudgets(bRes.data);
            setExpenses(eRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const processBudgets = () => {
        return budgets.map(budget => {
            const spent = expenses
                .filter(e => e.category === budget.category)
                .reduce((sum, e) => sum + e.amount, 0);
            return { ...budget, spent };
        });
    };

    const processedBudgets = processBudgets();

    const totalBudget = processedBudgets.reduce((acc, curr) => acc + curr.limit, 0);
    const totalSpent = processedBudgets.reduce((acc, curr) => acc + curr.spent, 0);

    const handleCreateBudget = async (e) => {
        e.preventDefault();
        try {
            await createBudget(newBudget);
            setIsModalOpen(false);
            setNewBudget({ category: '', limit: '', color: 'bg-violet-500' });
            fetchData();
        } catch (err) {
            alert('Failed to create budget');
        }
    };

    const handleDeleteBudget = async (id) => {
        if (window.confirm('Are you sure you want to delete this budget?')) {
            try {
                await deleteBudget(id);
                fetchData();
            } catch (err) {
                alert('Failed to delete budget');
            }
        }
    };

    return (
        <div className="space-y-8 animate-fade-in text-gray-900 dark:text-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-[Outfit]">Budget Planning</h1>
                    <p className="text-gray-500 dark:text-gray-400">Set limits and track your monthly spending goals.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 shadow-lg shadow-violet-500/20">
                    <Plus size={18} /> New Category
                </Button>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="flex justify-between items-start mb-4 relative">
                        <div className="p-3 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                            <Wallet size={24} />
                        </div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Budget</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">₹{totalBudget.toFixed(2)}</h3>
                </Card>

                <Card className="p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="flex justify-between items-start mb-4 relative">
                        <div className="p-3 rounded-xl bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400">
                            <TrendingUp size={24} />
                        </div>
                        <div className="text-xs font-bold px-2 py-1 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400">
                            {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0}% used
                        </div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Spent</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">₹{totalSpent.toFixed(2)}</h3>
                </Card>

                <Card className="p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                    <div className="flex justify-between items-start mb-4 relative">
                        <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                            <AlertCircle size={24} />
                        </div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Remaining</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">₹{(totalBudget - totalSpent).toFixed(2)}</h3>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 mt-4 overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${totalBudget > 0 ? Math.max(0, Math.min(100, ((totalBudget - totalSpent) / totalBudget) * 100)) : 0}%` }}></div>
                    </div>
                </Card>
            </div>

            {/* Budget Grid */}
            <h2 className="text-xl font-bold text-gray-900 dark:text-white font-[Outfit]">Category Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {processedBudgets.map(budget => {
                    const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
                    const isExceeded = budget.spent > budget.limit;
                    // Map old green classes to new structure if needed, or rely on the `budget.color` if it's generic enough.
                    // Since `budget.color` is saved in DB, we use it but might need to adjust opacity logic.
                    // For now assuming Tailwind classes.

                    return (
                        <Card key={budget._id} className="p-6 relative group hover:border-violet-300 dark:hover:border-violet-500/50 transition-all">
                            <div className="flex justify-between items-start mb-5">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-2xl ${budget.color} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center text-white`}>
                                        <div className={`w-5 h-5 rounded-full ${budget.color}`}></div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">{budget.category}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Monthly Limit</p>
                                    </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleDeleteBudget(budget._id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="mb-3 flex items-baseline gap-1">
                                <span className={`text-2xl font-bold ${isExceeded ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                                    ₹{budget.spent}
                                </span>
                                <span className="text-gray-400 text-sm"> / ₹{budget.limit}</span>
                            </div>

                            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 mb-3 overflow-hidden">
                                <div
                                    className={`h-2.5 rounded-full transition-all duration-500 ${isExceeded ? 'bg-red-500' : budget.color}`}
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>

                            <div className="flex justify-between text-xs font-medium">
                                <span className="text-gray-500 dark:text-gray-400">{Math.round(percentage)}% Used</span>
                                <span className={`${isExceeded ? 'text-red-500' : 'text-emerald-500'}`}>
                                    {isExceeded ? 'Over Budget' : 'On Track'}
                                </span>
                            </div>
                        </Card>
                    );
                })}

                {/* Add New Budget Trigger Card */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="border-2 border-dashed border-gray-200 dark:border-gray-700/50 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-300 dark:hover:border-violet-500/30 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-all group h-full min-h-[200px]"
                >
                    <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                        <Plus size={24} />
                    </div>
                    <span className="font-medium">Create New Budget</span>
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md p-6 animate-scale-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">New Budget Category</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateBudget} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">Category</label>
                                <div className="relative">
                                    <select
                                        value={newBudget.category}
                                        onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-3 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 appearance-none"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">Monthly Limit (₹)</label>
                                <Input
                                    type="number"
                                    value={newBudget.limit}
                                    onChange={(e) => setNewBudget({ ...newBudget, limit: e.target.value })}
                                    placeholder="e.g. 5000"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">Color Tag</label>
                                <div className="flex flex-wrap gap-3">
                                    {colors.map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setNewBudget({ ...newBudget, color })}
                                            className={`w-8 h-8 rounded-full ${color} transition-transform hover:scale-110 ${newBudget.color === color ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-500 dark:ring-offset-gray-900' : ''}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button type="submit" className="w-full shadow-lg shadow-violet-500/20">
                                    Create Budget
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Budgets;
