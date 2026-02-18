import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

const SpendingTrendsChart = ({ expenses = [], days = 7, income = 0 }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(30, 27, 75, 0.9)', // dark purple
                titleColor: '#fff',
                bodyColor: '#e5e7eb', // gray-200
                borderColor: 'rgba(124, 58, 237, 0.3)', // violet
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                cornerRadius: 12,
            }
        },
        scales: {
            y: {
                grid: {
                    color: 'rgba(124, 58, 237, 0.05)',
                    drawBorder: false,
                },
                ticks: {
                    color: '#9ca3af',
                    font: {
                        family: "'Outfit', sans-serif",
                        size: 11
                    }
                },
                border: {
                    display: false
                }
            },
            x: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    color: '#9ca3af',
                    font: {
                        family: "'Outfit', sans-serif",
                        size: 11
                    }
                },
                border: {
                    display: false
                }
            },
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
    };

    // Process expenses to get daily spending for the last N days
    const processData = () => {
        const lastNDays = [...Array(days)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - ((days - 1) - i));
            return d;
        });

        const labels = lastNDays.map(d => d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }));

        const expenseData = lastNDays.map(date => {
            const dayStr = date.toDateString();
            return expenses
                .filter(e => new Date(e.date).toDateString() === dayStr)
                .reduce((sum, e) => sum + e.amount, 0);
        });

        // Calculate daily income average (Total / 30) for comparison line
        const dailyIncome = income > 0 ? (income / 30) : 0;
        const incomeData = lastNDays.map(() => dailyIncome);

        return { labels, expenseData, incomeData };
    };

    const { labels, expenseData, incomeData } = processData();

    const data = {
        labels,
        datasets: [
            {
                fill: true,
                label: 'Expenses',
                data: expenseData,
                borderColor: '#8b5cf6', // Violet-500
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(139, 92, 246, 0.4)');
                    gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
                    return gradient;
                },
                borderWidth: 3,
                tension: 0.4,
                pointRadius: days > 14 ? 0 : 4,
                pointBackgroundColor: '#7c3aed',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 6,
            },
            {
                fill: false,
                label: 'Daily Budget',
                data: incomeData,
                borderColor: '#3b82f6', // Blue-500
                borderWidth: 2,
                borderDash: [5, 5],
                pointRadius: 0,
                tension: 0,
            }
        ],
    };

    return <Line options={options} data={data} />;
};

export default SpendingTrendsChart;
