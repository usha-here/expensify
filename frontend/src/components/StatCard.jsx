import React from 'react';
import Card from './ui/Card';

const StatCard = ({ title, amount, percentage, trend, icon: Icon, color }) => {
    // Map existing color props to new gradients if needed, or use them as accent colors
    const colorMap = {
        'bg-green-500': 'text-emerald-500 bg-emerald-500/10',
        'bg-blue-500': 'text-blue-500 bg-blue-500/10',
        'bg-yellow-500': 'text-amber-500 bg-amber-500/10',
        'bg-purple-500': 'text-violet-500 bg-violet-500/10',
    };

    const iconStyle = colorMap[color] || 'text-violet-500 bg-violet-500/10';

    return (
        <Card className="p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1 tracking-tight">
                        {amount}
                    </h3>
                </div>
                <div className={`p-3 rounded-xl ${iconStyle}`}>
                    <Icon size={24} />
                </div>
            </div>
            <div className="flex items-center gap-2">
                <span className={`inline-flex items-center text-xs font-semibold px-2 py-1 rounded-md ${trend === 'up' ? 'text-emerald-600 bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-400' : 'text-rose-600 bg-rose-100 dark:bg-rose-500/20 dark:text-rose-400'}`}>
                    {trend === 'up' ? '↑' : '↓'} {percentage}
                </span>
                <span className="text-gray-400 text-xs">vs last month</span>
            </div>
        </Card>
    );
};

export default StatCard;
