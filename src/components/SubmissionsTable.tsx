import React, { useState, useEffect } from 'react';
import { Eye, Trash2, ClipboardList } from 'lucide-react';
import useModals from './ModalContext';

interface Submission {
    id: string;
    date: string;
    score: number;
    category: 'Business Health' | 'Franchise Readiness';
    status: string;
    applicantName?: string;
    userId?: string;
}

interface SubmissionsTableProps {
    submissions: Submission[];
    onDeleteSubmission: (id: string) => Promise<void>;
}

const SubmissionsTable: React.FC<SubmissionsTableProps> = ({ submissions, onDeleteSubmission }) => {
    const { showConfirmation, showMessage } = useModals();
    const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>(submissions);
    const [filters, setFilters] = useState({ date: '', minScore: '', maxScore: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const totalPages = Math.ceil(filteredSubmissions.length / rowsPerPage);
    const paginatedSubmissions = filteredSubmissions.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    useEffect(() => {
        setFilteredSubmissions(submissions);
        setCurrentPage(1);
    }, [submissions]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.id]: e.target.value });
    };

    const applyFilters = () => {
        const { date, minScore, maxScore } = filters;
        const newFilteredData = submissions.filter(submission => {
            const formattedSubmissionDate = new Date(submission.date).toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata'
            });
            const matchesDate = date === '' || formattedSubmissionDate.includes(date);
            const matchesMinScore = isNaN(parseFloat(minScore)) || submission.score >= parseFloat(minScore);
            const matchesMaxScore = isNaN(parseFloat(maxScore)) || submission.score <= parseFloat(maxScore);
            return matchesDate && matchesMinScore && matchesMaxScore;
        });
        setFilteredSubmissions(newFilteredData);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({ date: '', minScore: '', maxScore: '' });
        setFilteredSubmissions(submissions);
        setCurrentPage(1);
    };

    const exportCsv = () => {
        const headers = ['ID', 'Date', 'Score', 'Category', 'Status'];
        const rows = [headers.join(',')];
        filteredSubmissions.forEach(s => {
            rows.push([s.id, s.date, s.score, s.category, s.status].map(field => `"${field.toString().replace(/"/g, '""')}"`).join(','));
        });
        const csvContent = rows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            link.setAttribute('href', URL.createObjectURL(blob));
            link.setAttribute('download', 'submissions_data.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showMessage('Success', 'Submissions exported to CSV!');
        } else {
            showMessage('Error', 'Your browser does not support CSV export.');
        }
    };

    const handleView = (submission: Submission & { applicantName?: string; userId?: string }) => {
        showMessage(
            `Submission Details - ${submission.id}`,
            `User ID: ${submission.userId ?? ''}\nUser Name: ${submission.applicantName ?? ''}\nDate: ${new Date(submission.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })}\nScore: ${submission.score}\nCategory: ${submission.category}\nStatus: ${submission.status}`
        );
    };

    const handleDelete = async (id: string) => {
        const confirmed = await showConfirmation(`Are you sure you want to delete submission ${id}?`);
        if (confirmed) {
            try {
                const res = await fetch(`/api/submissions?id=${id}`, { method: 'DELETE' });
                if (!res.ok) {
                    const data = await res.json();
                    showMessage('Error', data.message || 'Failed to delete submission.');
                    return;
                }
                await onDeleteSubmission(id);
                showMessage('Success', `Submission ${id} deleted.`);
            } catch (err: unknown) {
                showMessage('Error', err instanceof Error ? err.message : 'Failed to delete submission.');
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Submissions Overview</h2>
            <div className="flex flex-wrap gap-4 mb-6">
                <input
                    type="text"
                    id="date"
                    placeholder="Filter by Date (DD MMM YYYY)"
                    value={filters.date}
                    onChange={handleFilterChange}
                    className="flex-1 min-w-[150px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-200"
                />
                <input
                    type="number"
                    id="minScore"
                    placeholder="Min Score"
                    value={filters.minScore}
                    onChange={handleFilterChange}
                    className="flex-1 min-w-[100px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-200"
                />
                <input
                    type="number"
                    id="maxScore"
                    placeholder="Max Score"
                    value={filters.maxScore}
                    onChange={handleFilterChange}
                    className="flex-1 min-w-[100px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-200"
                />
                <button
                    onClick={applyFilters}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                >
                    <Eye size={18} className="mr-2" /> Apply Filters
                </button>
                <button
                    onClick={clearFilters}
                    className="bg-gray-400 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-500 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                >
                    <Trash2 size={18} className="mr-2" /> Clear Filters
                </button>
                <button
                    onClick={exportCsv}
                    className="bg-teal-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-teal-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                >
                    <ClipboardList size={18} className="mr-2" /> Export CSV
                </button>
            </div>

            <div className="overflow-x-auto rounded-xl shadow-inner">
                <table className="w-full whitespace-nowrap bg-white rounded-xl">
                    <thead className="bg-blue-700 text-white">
                        <tr>
                            <th className="p-4 text-left font-semibold text-sm uppercase rounded-tl-xl">ID</th>
                            <th className="p-4 text-left font-semibold text-sm uppercase">Date</th>
                            <th className="p-4 text-left font-semibold text-sm uppercase">Score</th>
                            <th className="p-4 text-left font-semibold text-sm uppercase">Category</th>
                            <th className="p-4 text-left font-semibold text-sm uppercase">Status</th>
                            <th className="p-4 text-left font-semibold text-sm uppercase rounded-tr-xl">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedSubmissions.length > 0 ? (
                            paginatedSubmissions.map((submission) => (
                                <tr key={submission.id} className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-150">
                                    <td className="p-4">{submission.id}</td>
                                    <td className="p-4">{
                                        new Date(submission.date).toLocaleDateString('en-IN', {
                                            day: '2-digit', month: 'short', year: 'numeric',
                                            timeZone: 'Asia/Kolkata'
                                        })
                                    }</td>
                                    <td className="p-4">{submission.score}</td>
                                    <td className="p-4">{submission.category}</td>
                                    <td className="p-4">{submission.status}</td>
                                    <td className="p-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleView(submission)}
                                                className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-sm hover:bg-gray-300 transition-colors duration-200 flex items-center shadow-sm hover:shadow-md"
                                            >
                                                <Eye size={16} className="mr-1" /> View
                                            </button>
                                            <button
                                                onClick={() => handleDelete(submission.id)}
                                                className="bg-red-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-red-600 transition-colors duration-200 flex items-center shadow-sm hover:shadow-md"
                                            >
                                                <Trash2 size={16} className="mr-1" /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="p-4 text-center text-gray-500">No submissions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg font-medium ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'} transition-all duration-200`}
                >
                    Previous
                </button>
                <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`px-4 py-2 rounded-lg font-medium ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'} transition-all duration-200`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default SubmissionsTable; 