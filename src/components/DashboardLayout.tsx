"use client";
import React, { useState, useEffect, ReactNode } from 'react';
import Sidebar from './Sidebar';
import HeaderBar from './HeaderBar';
import DashboardContent from './DashboardContent';
import SubmissionsTable from './SubmissionsTable';
import ManageQuestions from './ManageQuestions';
import ConfirmationModal from './ConfirmationModal';
import MessageModal from './MessageModal';
import { ModalContext } from './ModalContext';
import UsersTable from './UsersTable'; // Placeholder, will create this component
import ReportDashboardView from './ReportDashboardView';

// --- Interfaces for Data Models ---
interface Submission {
    id: string;
    date: string;
    score: number;
    category: 'Business Health' | 'Franchise Readiness';
    status: string;
    applicantName?: string;
    userId?: string;
}

interface DashboardLayoutProps {
    children?: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [activeTab, setActiveTab] = useState<string>('dashboardView');
    const [pageTitle, setPageTitle] = useState<string>('Dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    // Real Data State
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Dashboard stats state
    const [dashboardStats, setDashboardStats] = useState<unknown>(null);
    const [statsLoading, setStatsLoading] = useState<boolean>(true);
    const [statsError, setStatsError] = useState<string | null>(null);

    // Add state for charts data
    const [chartsData, setChartsData] = useState<unknown>(null);
    const [chartsLoading, setChartsLoading] = useState<boolean>(true);
    const [chartsError, setChartsError] = useState<string | null>(null);

    // Fetch submissions for table view
    useEffect(() => {
        const fetchSubmissions = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch('/api/submissions');
                if (!res.ok) throw new Error('Failed to fetch submissions');
                const data = await res.json();
                // Map API response to Submission[]
                const mapped = (data.submissions || []).map((s: unknown) => {
                    const submission = s as { questionnaireName?: string; id?: string | number; created_at?: string; total_score?: number; applicantName?: string; user_id?: string | number };
                    let category: 'Business Health' | 'Franchise Readiness' = 'Business Health';
                    if (submission.questionnaireName && submission.questionnaireName.toLowerCase().includes('franchise')) {
                        category = 'Franchise Readiness';
                    } else if (submission.questionnaireName && submission.questionnaireName.toLowerCase().includes('business')) {
                        category = 'Business Health';
                    }
                    return {
                        id: submission.id?.toString() ?? '',
                        date: submission.created_at?.slice(0, 10) ?? '',
                        score: submission.total_score ?? 0,
                        category,
                        status: 'Completed',
                        applicantName: submission.applicantName ?? '',
                        userId: submission.user_id?.toString() ?? '',
                    };
                });
                setSubmissions(mapped);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Error fetching submissions');
            } finally {
                setLoading(false);
            }
        };
        fetchSubmissions();
    }, []);

    // Fetch dashboard stats for dashboardView
    useEffect(() => {
        setStatsLoading(true);
        setStatsError(null);
        fetch('/api/dashboard/stats')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch dashboard stats');
                return res.json();
            })
            .then(data => setDashboardStats(data))
            .catch(err => setStatsError(err.message || 'Error fetching dashboard stats'))
            .finally(() => setStatsLoading(false));
    }, []);

    // Fetch dashboard charts data for dashboardView
    useEffect(() => {
        if (activeTab !== 'dashboardView') return;
        setChartsLoading(true);
        setChartsError(null);
        fetch('/api/dashboard/charts')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch dashboard charts');
                return res.json();
            })
            .then(data => setChartsData(data))
            .catch(err => setChartsError(err.message || 'Error fetching dashboard charts'))
            .finally(() => setChartsLoading(false));
    }, [activeTab]);

    // --- Tab Change Handler ---
    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        const titleMap: { [key: string]: string } = {
            dashboardView: 'Dashboard',
            usersView: 'User Management',
            submissionsView: 'Submissions',
            questionsView: 'Manage Questions',
            reportView: 'Report Dashboard',
        };
        setPageTitle(titleMap[tabId] || 'Admin Panel');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmModalMessage, setConfirmModalMessage] = useState('');
    const [confirmModalResolve, setConfirmModalResolve] = useState<((value: boolean) => void) | null>(null);

    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [messageModalTitle, setMessageModalTitle] = useState('');
    const [messageModalContent, setMessageModalContent] = useState('');

    const showConfirmation = (message: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setConfirmModalMessage(message);
            setIsConfirmModalOpen(true);
            setConfirmModalResolve(() => resolve);
        });
    };

    const handleConfirm = () => {
        setIsConfirmModalOpen(false);
        if (confirmModalResolve) {
            confirmModalResolve(true);
            setConfirmModalResolve(null);
        }
    };

    const handleCancelConfirm = () => {
        setIsConfirmModalOpen(false);
        if (confirmModalResolve) {
            confirmModalResolve(false);
            setConfirmModalResolve(null);
        }
    };

    const showMessage = (title: string, content: string) => {
        setMessageModalTitle(title);
        setMessageModalContent(content);
        setIsMessageModalOpen(true);
    };

    const handleCloseMessage = () => {
        setIsMessageModalOpen(false);
    };

    // --- Handlers for Data Management ---
    const handleDeleteSubmission = async (id: string) => {
        setSubmissions(prev => prev.filter(s => s.id !== id));
    };

    return (
        <ModalContext.Provider value={{ showConfirmation, showMessage }}>
            <div className="min-h-screen flex flex-row bg-gradient-to-tr from-gray-50 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <Sidebar
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                />
                {isSidebarOpen && <div className="fixed inset-0 bg-gray-900 bg-opacity-30 z-[999] lg:hidden" onClick={toggleSidebar}></div>}
                <div className="flex-1 flex flex-col h-screen max-h-screen transition-all duration-300 ease-in-out overflow-hidden">
                    <HeaderBar pageTitle={pageTitle} toggleSidebar={toggleSidebar} />
                    <main className="flex-1 w-full px-8 py-8 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {activeTab === 'dashboardView' ? (
                            statsLoading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                    <span className="ml-4 text-lg text-gray-600">Loading dashboard...</span>
                                </div>
                            ) : statsError ? (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                    <strong className="font-bold">Error:</strong>
                                    <span className="block sm:inline ml-2">{statsError}</span>
                                </div>
                            ) : dashboardStats ? (
                                <DashboardContent
                                    totalUsers={(dashboardStats as { totalUsers: number }).totalUsers}
                                    totalSubmissions={(dashboardStats as { totalSubmissions: number }).totalSubmissions}
                                    totalReports={(dashboardStats as { totalReports: number }).totalReports}
                                    activeQuestions={(dashboardStats as { activeQuestions: number }).activeQuestions}
                                    businessHealthDimensions={(dashboardStats as { businessHealthDimensions: { name: string; score: number }[] }).businessHealthDimensions}
                                    franchiseReadinessDimensions={(dashboardStats as { franchiseReadinessDimensions: { name: string; score: number }[] }).franchiseReadinessDimensions}
                                    chartsData={(chartsData || {}) as { averageScorePerTool?: { tool: string; avg_score: number }[]; weakestCategories?: { category: string; avg_score: number }[]; franchiseReadinessTrends?: { date: string; avg_score: number }[]; submissionsByTool?: { tool: string; submission_count: number }[] }}
                                    chartsLoading={chartsLoading}
                                    chartsError={chartsError}
                                />
                            ) : null
                        ) : activeTab === 'usersView' ? (
                            <UsersTable />
                        ) : activeTab === 'reportView' ? (
                            <ReportDashboardView />
                        ) : loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                <span className="ml-4 text-lg text-gray-600">Loading submissions...</span>
                            </div>
                        ) : error ? (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">Error:</strong>
                                <span className="block sm:inline ml-2">{error}</span>
                            </div>
                        ) : children ? children : (
                            <>
                                {activeTab === 'submissionsView' && (
                                    <SubmissionsTable
                                        submissions={submissions}
                                        onDeleteSubmission={handleDeleteSubmission}
                                    />
                                )}
                                {activeTab === 'questionsView' && (
                                    <ManageQuestions />
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                message={confirmModalMessage}
                onConfirm={handleConfirm}
                onCancel={handleCancelConfirm}
            />
            <MessageModal
                isOpen={isMessageModalOpen}
                title={messageModalTitle}
                content={messageModalContent}
                onClose={handleCloseMessage}
            />
        </ModalContext.Provider>
    );
};

export default DashboardLayout; 