import React, { useState, useRef } from 'react';
import { createExpense } from '../api/client';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import { Plus, X, Upload, Calendar, Tag, FileText, CheckCircle2 } from 'lucide-react';

const ExpenseForm = ({ onExpenseAdded }) => {
    const [amount, setAmount] = useState('0.00');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    // Mock categories for dropdown
    const categories = ['Food & Dining', 'Transport', 'Utilities', 'Shopping', 'Entertainment', 'Health', 'Travel'];

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleSubmit = async (e, addAnother = false) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData();
        formData.append('amount', amount);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('date', date);
        if (file) {
            formData.append('receipt', file);
        }

        try {
            await createExpense(formData);

            // Reset form
            setAmount('0.00');
            setCategory('');
            setDescription('');
            setDate('');
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';

            if (onExpenseAdded) onExpenseAdded();

            if (!addAnother) {
                // Logic if we wanted to visually indicate completion without clearing immediately suitable for Single add
            }
        } catch (err) {
            setError('Failed to add expense. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="h-full relative overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                <div className="flex items-center gap-3">
                    <div className="bg-violet-600 p-1.5 rounded-lg shadow-lg shadow-violet-500/20">
                        <Plus size={18} className="text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white font-[Outfit]">New Expense</h2>
                </div>
            </div>

            <form onSubmit={(e) => handleSubmit(e, false)} className="p-6 space-y-5">
                {error && <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">{error}</div>}

                {/* Amount Section */}
                <div className="relative group">
                    <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2 text-center">Total Amount</label>
                    <div className="flex items-center justify-center gap-1">
                        <span className="text-3xl font-bold text-violet-600 dark:text-violet-400">₹</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="bg-transparent text-5xl font-bold text-gray-800 dark:text-white text-center w-full max-w-[200px] focus:outline-none focus:ring-0 border-b-2 border-transparent focus:border-violet-500/50 transition-all placeholder-gray-300"
                            placeholder="0.00"
                            step="0.01"
                            required
                        />
                    </div>
                </div>

                {/* Inputs Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-500 ml-1">Category</label>
                        <div className="relative">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white py-2.5 px-3 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-sm appearance-none"
                                required
                            >
                                <option value="" disabled>Select...</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                <Tag size={14} />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-500 ml-1">Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white py-2.5 px-3 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-sm"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-500 ml-1">Description</label>
                    <div className="relative">
                        <FileText size={16} className="absolute left-3 top-3 text-gray-400" />
                        <textarea
                            rows={2}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white py-2.5 pl-10 pr-4 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-sm resize-none placeholder-gray-400"
                            placeholder="What was this for?"
                            required
                        />
                    </div>
                </div>

                {/* File Upload - Styled Minimal */}
                <div
                    className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/30 hover:border-violet-300 dark:hover:border-violet-500/30 transition-all group"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current.click()}
                >
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload size={14} className="text-violet-600 dark:text-violet-400" />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {file ? <span className="text-violet-600 font-medium">{file.name}</span> : <span>Click to upload receipt</span>}
                        </p>
                    </div>
                    <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf,.svg" />
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={(e) => handleSubmit(e, true)}
                        disabled={loading}
                        className="w-full"
                    >
                        Save & Add
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        isLoading={loading}
                        className="w-full shadow-lg shadow-violet-500/20"
                    >
                        Save Expense
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default ExpenseForm;
