import React, { useState, useEffect } from 'react';
import { getSubscriptions, createSubscription, deleteSubscription } from '../api/client';
import { Plus, Calendar, DollarSign, Trash2, Edit2, AlertTriangle, CreditCard, Clock } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Subscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newSub, setNewSub] = useState({
        serviceName: '',
        amount: '',
        currency: 'INR',
        billingCycle: 'Monthly',
        nextDueDate: '',
        category: 'Entertainment'
    });

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            const res = await getSubscriptions();
            setSubscriptions(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createSubscription(newSub);
            setIsModalOpen(false);
            setNewSub({
                serviceName: '',
                amount: '',
                currency: 'INR',
                billingCycle: 'Monthly',
                nextDueDate: '',
                category: 'Entertainment'
            });
            fetchSubscriptions();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this subscription?')) {
            try {
                await deleteSubscription(id);
                fetchSubscriptions();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const calculateTotalMonthly = () => {
        return subscriptions.reduce((acc, sub) => {
            if (sub.billingCycle === 'Monthly') return acc + sub.amount;
            return acc + (sub.amount / 12);
        }, 0);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-[Outfit]">Subscriptions</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage recurring payments and track upcoming bills.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 shadow-lg shadow-violet-500/20">
                    <Plus size={18} /> Add Subscription
                </Button>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                            <Clock size={24} />
                        </div>
                        <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                            Active
                        </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Monthly Cost</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">₹{calculateTotalMonthly().toFixed(2)}</h3>
                    <p className="text-gray-400 text-xs mt-2"> Across {subscriptions.length} services</p>
                </Card>

                <Card className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                            <DollarSign size={24} />
                        </div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Yearly Projection</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">₹{(calculateTotalMonthly() * 12).toFixed(2)}</h3>
                    <p className="text-gray-400 text-xs mt-2">Estimated total</p>
                </Card>

                <Card className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                            <AlertTriangle size={24} />
                        </div>
                        <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                            Upcoming
                        </span>
                    </div>
                    {subscriptions.length > 0 ? (
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Next Payment</p>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1 truncate">
                                {subscriptions.sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate))[0].serviceName}
                            </h3>
                            <p className="text-violet-600 dark:text-violet-400 text-sm font-semibold mt-1">
                                Due {format(new Date(subscriptions.sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate))[0].nextDueDate), 'MMM dd')}
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center h-full">
                            <p className="text-gray-400 text-sm">No active subscriptions</p>
                        </div>
                    )}
                </Card>
            </div>

            {/* Subscriptions List */}
            <Card className="overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Active Subscriptions</h2>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {subscriptions.map(sub => {
                        const daysLeft = differenceInDays(new Date(sub.nextDueDate), new Date());
                        return (
                            <div key={sub._id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group gap-4 px-6 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/20 rounded-2xl flex items-center justify-center font-bold text-xl text-violet-600 dark:text-violet-400 shadow-sm">
                                        {sub.serviceName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">{sub.serviceName}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs border border-gray-200 dark:border-gray-700">{sub.category}</span>
                                            <span>•</span>
                                            <span>{sub.billingCycle}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-gray-900 dark:text-white">₹{sub.amount}</p>
                                        <p className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block ${daysLeft <= 3 ? 'text-red-600 bg-red-50 dark:bg-red-900/20' : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'}`}>
                                            Due in {daysLeft} days
                                        </p>
                                    </div>
                                    <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded-xl transition-colors">
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(sub._id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {subscriptions.length === 0 && (
                        <div className="p-16 text-center text-gray-400 flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                <CreditCard size={24} className="opacity-50" />
                            </div>
                            <p>No subscriptions found. Note down your recurring bills!</p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Add Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 font-[Outfit]">Add Subscription</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">Service Name</label>
                                <Input
                                    type="text"
                                    value={newSub.serviceName}
                                    onChange={e => setNewSub({ ...newSub, serviceName: e.target.value })}
                                    placeholder="e.g. Netflix"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">Amount</label>
                                    <Input
                                        type="number"
                                        value={newSub.amount}
                                        onChange={e => setNewSub({ ...newSub, amount: e.target.value })}
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">Cycle</label>
                                    <div className="relative">
                                        <select
                                            value={newSub.billingCycle}
                                            onChange={e => setNewSub({ ...newSub, billingCycle: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-3 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 appearance-none text-sm"
                                        >
                                            <option value="Monthly">Monthly</option>
                                            <option value="Yearly">Yearly</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1.5">Next Due Date</label>
                                <Input
                                    type="date"
                                    value={newSub.nextDueDate}
                                    onChange={e => setNewSub({ ...newSub, nextDueDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex gap-3 mt-6 pt-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 shadow-md shadow-violet-500/20"
                                >
                                    Save Subscription
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Subscriptions;
