import React, { useEffect, useState } from 'react';
import { getExpenses } from '../api/client';
import Card from './ui/Card';
import { Filter, Calendar, Receipt, ChevronDown } from 'lucide-react';

const ExpenseList = ({ refreshTrigger }) => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('date_desc');

    const fetchExpenses = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {};
            if (categoryFilter) params.category = categoryFilter;
            if (sortOrder) params.sort = sortOrder;

            const response = await getExpenses(params);
            setExpenses(response.data);
        } catch (err) {
            setError('Failed to load expenses.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [refreshTrigger, categoryFilter, sortOrder]);

    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    return (
        <Card className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-t-2xl">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white font-[Outfit]">Recent Expenses</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your daily spending</p>
                </div>
                <div className="bg-violet-100 dark:bg-violet-900/30 px-3 py-1 rounded-full text-xs font-semibold text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800/50">
                    {expenses.length} entries
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-violet-500 transition-colors">
                            <Filter size={16} />
                        </span>
                        <input
                            type="text"
                            placeholder="Filter by Category..."
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-2.5 pl-10 pr-4 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all placeholder-gray-400 sm:text-sm"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all sm:text-sm appearance-none cursor-pointer"
                        >
                            <option value="date_desc">Newest First</option>
                            <option value="date_asc">Oldest First</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>

                {/* Total Summary */}
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 rounded-xl shadow-lg shadow-violet-500/20 flex justify-between items-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
                    <span className="font-medium text-violet-100 text-sm uppercase tracking-wider relative z-10">Total Spent</span>
                    <span className="text-2xl font-bold relative z-10">₹{totalAmount.toFixed(2)}</span>
                </div>

                {/* List */}
                <div className="flex-1 overflow-visible">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>
                        </div>
                    ) : error ? (
                        <div className="text-red-500 text-center py-8 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/30 text-sm">{error}</div>
                    ) : expenses.length === 0 ? (
                        <div className="text-center py-16 text-gray-400 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Receipt size={24} className="text-gray-400" />
                            </div>
                            <p className="text-sm">No expenses found.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {expenses.map((expense) => (
                                <div key={expense._id} className="bg-white dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 hover:border-violet-200 dark:hover:border-violet-500/30 hover:shadow-md hover:shadow-violet-500/5 transition-all group flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center flex-shrink-0 text-violet-600 dark:text-violet-400 font-bold text-lg group-hover:scale-110 transition-transform">
                                        {expense.description.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{expense.description}</p>
                                            <p className="font-bold text-gray-900 dark:text-white tracking-tight">₹{expense.amount.toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                                                {expense.category}
                                            </span>
                                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                                <Calendar size={12} />
                                                {new Date(expense.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </div>
                                            {expense.receipt && (
                                                <a
                                                    href={`http://localhost:3001/${expense.receipt}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-xs text-violet-600 hover:text-violet-500 gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title="View Receipt"
                                                >
                                                    <Receipt size={12} />
                                                    Receipt
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default ExpenseList;
