import React from 'react';
import Card from './ui/Card';

const BudgetStatus = ({ budgets = [], expenses = [] }) => {

    const processedBudgets = budgets.map(budget => {
        const spent = expenses
            .filter(e => e.category === budget.category)
            .reduce((sum, e) => sum + e.amount, 0);
        return { ...budget, spent };
    });

    const totalBudget = processedBudgets.reduce((sum, b) => sum + b.limit, 0);
    const totalSpent = processedBudgets.reduce((sum, b) => sum + b.spent, 0);
    const totalPercentage = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

    return (
        <Card className="h-full p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Budget Status</h3>
            {processedBudgets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No budgets set yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {processedBudgets.slice(0, 3).map((budget, index) => {
                        const percent = Math.min((budget.spent / budget.limit) * 100, 100);
                        return (
                            <div key={index}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-gray-700 dark:text-gray-200">{budget.category}</span>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        <span className="text-gray-900 dark:text-white font-bold">₹{budget.spent.toFixed(0)}</span> / ₹{budget.limit}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${percent > 90 ? 'bg-red-500' :
                                                percent > 75 ? 'bg-amber-500' :
                                                    'bg-violet-500'
                                            }`}
                                        style={{ width: `${percent}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {processedBudgets.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="transparent"
                                className="text-gray-100 dark:text-gray-700"
                            />
                            <circle
                                cx="32"
                                cy="32"
                                r="28"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="transparent"
                                strokeDasharray={175}
                                strokeDashoffset={175 - (175 * totalPercentage) / 100}
                                className={`${totalPercentage > 90 ? 'text-red-500' : 'text-violet-500'} transition-all duration-1000 ease-out`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <span className="absolute text-xs font-bold text-gray-900 dark:text-white">{Math.round(totalPercentage)}%</span>
                    </div>
                    <div className="flex-1 ml-4">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">Total Used</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {totalPercentage < 80 ? "On track this month" : "Approaching limit"}
                        </p>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default BudgetStatus;
