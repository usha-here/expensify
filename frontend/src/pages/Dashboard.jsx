import React, { useState, useEffect } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import StatCard from '../components/StatCard';
import SpendingTrendsChart from '../components/SpendingTrendsChart';
import BudgetStatus from '../components/BudgetStatus';
import { getExpenses, getBudgets } from '../api/client';
import { DollarSign, CreditCard, TrendingUp, Wallet } from 'lucide-react';
import Card from '../components/ui/Card';

const Dashboard = () => {
    const [expenses, setExpenses] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [timeRange, setTimeRange] = useState('7');

    const fetchData = async () => {
        try {
            const [expensesRes, budgetsRes] = await Promise.all([
                getExpenses(),
                getBudgets()
            ]);
            setExpenses(expensesRes.data);
            setBudgets(budgetsRes.data);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [refreshTrigger]);

    const handleExpenseAdded = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    // Analytics Calculation
    const totalSpending = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Calculate monthly spending (simple filter for current month)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlySpending = expenses
        .filter(e => {
            const d = new Date(e.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        })
        .reduce((sum, e) => sum + e.amount, 0);

    // Mock Income
    const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
    const balance = 50000 - totalSpending;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Balance"
                    amount={`₹${balance.toFixed(2)}`}
                    percentage="12%"
                    trend="up"
                    icon={Wallet}
                    color="bg-green-500"
                />
                <StatCard
                    title="Monthly Spending"
                    amount={`₹${monthlySpending.toFixed(2)}`}
                    percentage="5%"
                    trend="down"
                    icon={CreditCard}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Total Budget"
                    amount={`₹${totalBudget.toFixed(2)}`}
                    percentage="--"
                    trend="up"
                    icon={DollarSign}
                    color="bg-yellow-500"
                />
                <StatCard
                    title="Total Expenses"
                    amount={`₹${totalSpending.toFixed(2)}`}
                    percentage="8%"
                    trend="down"
                    icon={TrendingUp}
                    color="bg-purple-500"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Spending Trends</h3>
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="bg-gray-50 dark:bg-gray-800 border-none text-sm text-gray-500 rounded-lg focus:ring-0 cursor-pointer"
                        >
                            <option value="7">Last 7 Days</option>
                            <option value="30">Last Month</option>
                        </select>
                    </div>
                    <div className="h-72 w-full">
                        <SpendingTrendsChart expenses={expenses} days={parseInt(timeRange)} />
                    </div>
                </Card>
                <div className="lg:col-span-1">
                    <ExpenseForm onExpenseAdded={handleExpenseAdded} />
                </div>
            </div>

            {/* Bottom Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ExpenseList refreshTrigger={refreshTrigger} />
                </div>
                <div className="lg:col-span-1">
                    <BudgetStatus budgets={budgets} expenses={expenses} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
