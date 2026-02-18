import React, { useEffect, useState } from 'react';
import { getExpenses } from '../api/client';
import { Search, Filter, Calendar, MoreHorizontal, X, Plus } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ExpenseForm from '../components/ExpenseForm';

const Transactions = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [dateRange, setDateRange] = useState('30_days');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchTransactions();
    }, [category, dateRange]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const params = {};
            if (category) params.category = category;
            const res = await getExpenses(params);
            setExpenses(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleExpenseAdded = () => {
        setIsModalOpen(false);
        fetchTransactions();
    };

    const filteredExpenses = expenses.filter(expense =>
        expense.description.toLowerCase().includes(search.toLowerCase()) ||
        expense.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in text-gray-900 dark:text-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-[Outfit]">Transactions</h1>
                    <p className="text-gray-500 dark:text-gray-400">View and manage your financial history.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 shadow-lg shadow-violet-500/20"
                    >
                        <Plus size={18} />
                        <span>Add Transaction</span>
                    </Button>
                </div>
            </div>

            <Card className="p-5">
                {/* Filters Bar */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all placeholder-gray-400 text-sm"
                        />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-sm cursor-pointer"
                        >
                            <option value="30_days">Last 30 Days</option>
                            <option value="90_days">Last 3 Months</option>
                            <option value="year">This Year</option>
                        </select>

                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-sm cursor-pointer"
                        >
                            <option value="">All Categories</option>
                            <option value="Food & Dining">Food & Dining</option>
                            <option value="Transport">Transport</option>
                            <option value="Utilities">Utilities</option>
                            <option value="Shopping">Shopping</option>
                        </select>
                    </div>
                </div>

                {/* Transactions List */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                                <th className="p-4 font-medium w-12">#</th>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium">Description</th>
                                <th className="p-4 font-medium">Category</th>
                                <th className="p-4 font-medium text-right">Amount</th>
                                <th className="p-4 font-medium text-center">Status</th>
                                <th className="p-4 font-medium text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="p-12 text-center text-gray-500">
                                        <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-2"></div>
                                        Loading transactions...
                                    </td>
                                </tr>
                            ) : filteredExpenses.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-12 text-center text-gray-500">
                                        No transactions found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredExpenses.map((expense, index) => (
                                    <tr key={expense._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                        <td className="p-4 text-gray-400 text-sm">{index + 1}</td>
                                        <td className="p-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                <Calendar size={14} className="text-gray-400" />
                                                <span className="text-sm">{new Date(expense.date).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold text-xs">
                                                    {expense.description.charAt(0)}
                                                </div>
                                                <p className="font-medium text-gray-900 dark:text-white text-sm">{expense.description}</p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className="font-bold text-gray-900 dark:text-white">
                                                ₹{expense.amount.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                Completed
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button className="p-1.5 text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-lg transition-colors">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Mock) */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-sm text-gray-500">
                    <span>Showing <strong>{filteredExpenses.length}</strong> transactions</span>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" disabled>Previous</Button>
                        <Button variant="ghost" size="sm" disabled>Next</Button>
                    </div>
                </div>
            </Card>

            {/* Add Transaction Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl animate-scale-in">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute -top-10 right-0 md:-right-10 text-white hover:text-gray-300 p-2"
                        >
                            <X size={24} />
                        </button>
                        <div className="overflow-hidden rounded-2xl">
                            <ExpenseForm onExpenseAdded={handleExpenseAdded} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transactions;
