import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Users, ClipboardList, FileText, HelpCircle } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

interface DashboardContentProps {
    totalUsers: number;
    totalSubmissions: number;
    totalReports: number;
    activeQuestions: number;
    businessHealthDimensions: { name: string; score: number }[];
    franchiseReadinessDimensions: { name: string; score: number }[];
    chartsData?: {
        averageScorePerTool?: { tool: string; avg_score: number }[];
        weakestCategories?: { category: string; avg_score: number }[];
        franchiseReadinessTrends?: { date: string; avg_score: number }[];
        submissionsByTool?: { tool: string; submission_count: number }[];
    };
    chartsLoading?: boolean;
    chartsError?: string | null;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
    totalUsers = 0,
    totalSubmissions = 0,
    totalReports = 0,
    activeQuestions = 0,
    businessHealthDimensions = [],
    franchiseReadinessDimensions = [],
    chartsData = {},
    chartsLoading,
    chartsError,
}) => {
    // Chart data preparation
    const avgScoreData = chartsData.averageScorePerTool || [];
    const avgScoreBarData = {
        labels: avgScoreData.map((d) => d.tool),
        datasets: [
            {
                label: 'Average Score',
                data: avgScoreData.map((d) => d.avg_score),
                backgroundColor: 'rgba(59,130,246,0.7)',
                borderColor: 'rgba(59,130,246,1)',
                borderWidth: 2,
                borderRadius: 8,
            },
        ],
    };
    const trendsData = chartsData.franchiseReadinessTrends || [];
    const trendsLineData = {
        labels: trendsData.map((d) => d.date),
        datasets: [
            {
                label: 'Avg Score',
                data: trendsData.map((d) => d.avg_score),
                fill: false,
                borderColor: 'rgba(250,204,21,1)',
                backgroundColor: 'rgba(250,204,21,0.5)',
                tension: 0.3,
            },
        ],
    };
    const pieData = chartsData.submissionsByTool || [];
    const submissionsPieData = {
        labels: pieData.map((d) => d.tool),
        datasets: [
            {
                data: pieData.map((d) => d.submission_count),
                backgroundColor: [
                    'rgba(59,130,246,0.7)',
                    'rgba(34,197,94,0.7)',
                    'rgba(250,204,21,0.7)',
                    'rgba(236,72,153,0.7)',
                    'rgba(139,92,246,0.7)',
                ],
                borderColor: [
                    'rgba(59,130,246,1)',
                    'rgba(34,197,94,1)',
                    'rgba(250,204,21,1)',
                    'rgba(236,72,153,1)',
                    'rgba(139,92,246,1)',
                ],
                borderWidth: 2,
            },
        ],
    };

    return (
        <div className="space-y-10">
            {/* Top: 2x2 cards + Pie Chart (row-span-2) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* First column: Total Users + Total Reports */}
                <div className="space-y-8">
                    <div className={`p-7 rounded-2xl shadow-2xl flex items-center justify-between bg-white/70 backdrop-blur-md border border-gray-200 hover:shadow-3xl transition-all duration-300 group relative overflow-hidden`}> 
                        <Users size={48} className="text-blue-500 mr-4 drop-shadow-lg" />
                        <div className="text-right">
                            <div className="text-4xl font-extrabold text-gray-900 flex items-center gap-2">
                                {totalUsers}
                                <span className="inline-block w-3 h-3 bg-green-400 rounded-full animate-pulse" title="Online" />
                            </div>
                            <div className="text-lg text-gray-600 font-semibold">Total Users</div>
                        </div>
                    </div>
                    <div className={`p-7 rounded-2xl shadow-2xl flex items-center justify-between bg-white/70 backdrop-blur-md border border-gray-200 hover:shadow-3xl transition-all duration-300 group relative overflow-hidden`}>
                        <FileText size={48} className="text-purple-500 mr-4 drop-shadow-lg" />
                        <div className="text-right">
                            <div className="text-4xl font-extrabold text-gray-900">{totalReports}</div>
                            <div className="text-lg text-gray-600 font-semibold">Total Reports</div>
                        </div>
                    </div>
                </div>
                {/* Second column: Total Submissions + Active Questions */}
                <div className="space-y-8">
                    <div className={`p-7 rounded-2xl shadow-2xl flex items-center justify-between bg-white/70 backdrop-blur-md border border-gray-200 hover:shadow-3xl transition-all duration-300 group relative overflow-hidden`}>
                        <ClipboardList size={48} className="text-teal-500 mr-4 drop-shadow-lg" />
                        <div className="text-right">
                            <div className="text-4xl font-extrabold text-gray-900">{totalSubmissions}</div>
                            <div className="text-lg text-gray-600 font-semibold">Total Submissions</div>
                        </div>
                    </div>
                    <div className={`p-7 rounded-2xl shadow-2xl flex items-center justify-between bg-white/70 backdrop-blur-md border border-gray-200 hover:shadow-3xl transition-all duration-300 group relative overflow-hidden`}>
                        <HelpCircle size={48} className="text-pink-500 mr-4 drop-shadow-lg" />
                        <div className="text-right">
                            <div className="text-4xl font-extrabold text-gray-900">{activeQuestions}</div>
                            <div className="text-lg text-gray-600 font-semibold">Active Questions</div>
                        </div>
                    </div>
                </div>
                {/* Pie Chart, row-span-2 */}
                <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl flex flex-col justify-between min-h-[300px] row-span-2 border border-gray-200 hover:shadow-3xl transition-all duration-300">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Submissions by Tool</h3>
                    <div className="flex-grow min-h-[200px]">
                        {chartsLoading ? (
                            <div className="flex items-center justify-center h-full animate-pulse">
                                <div className="w-24 h-24 bg-gray-200 rounded-full" />
                            </div>
                        ) : chartsError ? (
                            <div className="text-red-500">{chartsError}</div>
                        ) : (
                            <Pie data={submissionsPieData} options={{ responsive: true, maintainAspectRatio: false }} />
                        )}
                    </div>
                </div>
            </div>
            {/* Franchise Readiness Trends Over Time (Line) */}
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full border border-gray-200 hover:shadow-3xl transition-all duration-300">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Franchise Readiness Trends Over Time</h3>
                <div className="h-72">
                    {chartsLoading ? (
                        <div className="flex items-center justify-center h-full animate-pulse">
                            <div className="w-full h-12 bg-gray-200 rounded" />
                        </div>
                    ) : chartsError ? (
                        <div className="text-red-500">{chartsError}</div>
                    ) : (
                        <Line 
                            data={trendsLineData} 
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    x: {
                                        ticks: {
                                            callback: function(value) {
                                                const label = trendsLineData.labels[Number(value)];
                                                if (!label) return '';
                                                const date = new Date(label);
                                                return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                                            },
                                            color: '#888',
                                            font: { size: 12, weight: 'bold' },
                                        },
                                    },
                                },
                                plugins: {
                                    tooltip: {
                                        callbacks: {
                                            title: function(context) {
                                                const label = context[0]?.label;
                                                if (!label) return '';
                                                const date = new Date(label);
                                                return date.toLocaleString('en-IN', {
                                                    day: '2-digit', month: 'short', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit', hour12: true,
                                                    timeZone: 'Asia/Kolkata'
                                                });
                                            }
                                        }
                                    }
                                }
                            }} 
                        />
                    )}
                </div>
            </div>
            {/* Business Health (Dimension-wise) | Franchise Readiness (Dimension-wise) | Average Score Per Tool */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Business Health (Dimension-wise)</h3>
                    <div className="flex-grow h-72">
                        <Bar data={{
                            labels: businessHealthDimensions.map(d => d.name),
                            datasets: [
                                {
                                    label: 'Score',
                                    data: businessHealthDimensions.map(d => d.score),
                                    backgroundColor: 'rgba(34,197,94,0.7)',
                                    borderColor: 'rgba(34,197,94,1)',
                                    borderWidth: 2,
                                    borderRadius: 8,
                                },
                            ],
                        }} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Franchise Readiness (Dimension-wise)</h3>
                    <div className="flex-grow h-72">
                        <Bar data={{
                            labels: franchiseReadinessDimensions.map(d => d.name),
                            datasets: [
                                {
                                    label: 'Score',
                                    data: franchiseReadinessDimensions.map(d => d.score),
                                    backgroundColor: 'rgba(250,204,21,0.7)',
                                    borderColor: 'rgba(250,204,21,1)',
                                    borderWidth: 2,
                                    borderRadius: 8,
                                },
                            ],
                        }} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Average Score Per Tool</h3>
                    <div className="flex-grow h-72">
                        {chartsLoading ? (
                            <div className="flex items-center justify-center h-full">Loading...</div>
                        ) : chartsError ? (
                            <div className="text-red-500">{chartsError}</div>
                        ) : (
                            <Bar data={avgScoreBarData} options={{ responsive: true, maintainAspectRatio: false }} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardContent; 