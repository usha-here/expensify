import React, { useState, useEffect } from 'react';
import SpendingTrendsChart from '../components/SpendingTrendsChart';
import { getExpenses } from '../api/client';
import { Download, Calendar, FileText, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Reports = () => {
    const [expenses, setExpenses] = useState([]);
    const [dateRange, setDateRange] = useState(30);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const res = await getExpenses();
                setExpenses(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchExpenses();
    }, []);

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    // Mocking income for now as there's no income tracking feature yet
    const totalIncome = 50000;
    const netSavings = totalIncome - totalExpenses;

    const handleExportCSV = () => {
        const headers = ["Date", "Category", "Description", "Amount (INR)"];
        const rows = expenses.map(e => [
            new Date(e.date).toLocaleDateString(),
            e.category,
            e.description,
            e.amount
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'financial_report.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();

        // Add Title
        doc.setFontSize(18);
        doc.setTextColor(76, 29, 149); // Violet-900
        doc.text("Financial Report", 14, 22);

        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

        // Summary
        doc.text(`Total Income: ${totalIncome.toFixed(2)}`, 14, 40);
        doc.text(`Total Expenses: ${totalExpenses.toFixed(2)}`, 14, 46);
        doc.text(`Net Savings: ${netSavings.toFixed(2)}`, 14, 52);

        // Table
        const tableColumn = ["Date", "Category", "Description", "Amount"];
        const tableRows = [];

        expenses.forEach(expense => {
            const expenseData = [
                new Date(expense.date).toLocaleDateString(),
                expense.category,
                expense.description,
                expense.amount.toFixed(2),
            ];
            tableRows.push(expenseData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 60,
            headStyles: { fillColor: [124, 58, 237] }, // Violet-600
        });

        doc.save("financial_report.pdf");
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-[Outfit]">Financial Reports</h1>
                    <p className="text-gray-500 dark:text-gray-400">Deep dive into your spending habits.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="ghost"
                        onClick={() => setDateRange(prev => prev === 7 ? 30 : 7)}
                        className="flex items-center gap-2"
                    >
                        <Calendar size={18} />
                        {dateRange === 30 ? 'Last 30 Days' : 'Last 7 Days'}
                    </Button>
                    <Button
                        onClick={handleExportPDF}
                        className="flex items-center gap-2 shadow-lg shadow-violet-500/20"
                    >
                        <Download size={18} /> Export PDF
                    </Button>
                </div>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Total Income</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">₹{totalIncome.toFixed(2)}</h3>
                    <p className="text-xs text-gray-400 mt-1">Estimated monthly</p>
                </Card>

                <Card className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                            <TrendingDown size={24} />
                        </div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Total Expenses</p>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">₹{totalExpenses.toFixed(2)}</h3>
                </Card>

                <Card className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                            <DollarSign size={24} />
                        </div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Net Savings</p>
                    <h3 className={`text-3xl font-bold ${netSavings >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        ₹{netSavings.toFixed(2)}
                    </h3>
                </Card>
            </div>

            {/* Main Chart */}
            <Card className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 font-[Outfit]">Income vs Expense ({dateRange} Days)</h3>
                <div className="h-80 w-full">
                    <SpendingTrendsChart
                        expenses={expenses}
                        days={dateRange}
                        income={totalIncome}
                    />
                </div>
            </Card>

            {/* Export Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card
                    onClick={handleExportPDF}
                    className="p-6 hover:border-violet-300 dark:hover:border-violet-500/50 transition-all group cursor-pointer"
                >
                    <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
                        <FileText className="text-red-500" size={28} />
                    </div>
                    <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-1">Export as PDF</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Best for printing or sharing professionally.</p>
                    <span className="text-violet-600 dark:text-violet-400 text-sm font-medium group-hover:underline flex items-center gap-1">
                        Download Now <ArrowDownRight size={16} />
                    </span>
                </Card>

                <Card
                    onClick={handleExportCSV}
                    className="p-6 hover:border-violet-300 dark:hover:border-violet-500/50 transition-all group cursor-pointer"
                >
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-4 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                        <FileText className="text-emerald-500" size={28} />
                    </div>
                    <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-1">Export as CSV</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Raw data for analysis in Excel or Sheets.</p>
                    <span className="text-violet-600 dark:text-violet-400 text-sm font-medium group-hover:underline flex items-center gap-1">
                        Download Now <ArrowDownRight size={16} />
                    </span>
                </Card>
            </div>
            {/* Use ArrowDownRight icon component or just text if icon missing */}
        </div>
    );
};

// Helper component for arrow if needed, but lucid-react should have it.
const ArrowDownRight = ({ size = 24, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="7" y1="7" x2="17" y2="17"></line><polyline points="17 7 17 17 7 17"></polyline></svg>
)

export default Reports;
