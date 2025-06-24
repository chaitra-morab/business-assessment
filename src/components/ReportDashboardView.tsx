import React, { useEffect, useState } from 'react';

interface Report {
  id: number;
  username: string;
  type: string;
  sent_to_email: boolean;
  created_at: string;
}

const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).replace(/ /g, ' ');
};

const ReportDashboardView: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [searchDate, setSearchDate] = useState('');

  const fetchReports = async (name = '', date = '') => {
    setLoading(true);
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    if (date) params.append('date', date);
    const res = await fetch(`/api/report?${params.toString()}`);
    const data = await res.json();
    setReports(data.reports || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReports(searchName, searchDate);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Search by Name</label>
            <input
              type="text"
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter username"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Search by Date</label>
            <input
              type="date"
              value={searchDate}
              onChange={e => {
                const val = e.target.value;
                if (val) {
                  const d = new Date(val);
                  setSearchDate(formatDate(d));
                } else {
                  setSearchDate('');
                }
              }}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition self-end"
          >
            Search
          </button>
        </form>
      </div>
      <div className="bg-white rounded-2xl shadow-xl p-2 sm:p-4 md:p-6 overflow-x-auto">
        {loading ? (
          <div className="text-gray-500 text-center py-8">Loading...</div>
        ) : (
          <table className="min-w-[600px] w-full border-separate border-spacing-y-2 text-xs sm:text-sm md:text-base">
            <thead className="sticky top-0 z-10 bg-white">
              <tr>
                <th className="px-2 sm:px-4 py-2 text-left font-bold text-gray-600 uppercase tracking-wider bg-gray-100 rounded-tl-xl">ID</th>
                <th className="px-2 sm:px-4 py-2 text-left font-bold text-gray-600 uppercase tracking-wider bg-gray-100">Username</th>
                <th className="px-2 sm:px-4 py-2 text-left font-bold text-gray-600 uppercase tracking-wider bg-gray-100">Type</th>
                <th className="px-2 sm:px-4 py-2 text-left font-bold text-gray-600 uppercase tracking-wider bg-gray-100">Sent to Email</th>
                <th className="px-2 sm:px-4 py-2 text-left font-bold text-gray-600 uppercase tracking-wider bg-gray-100 rounded-tr-xl">Created At</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr className="bg-gray-50">
                  <td className="px-2 sm:px-4 py-2 rounded-l-xl">0</td>
                  <td className="px-2 sm:px-4 py-2">-</td>
                  <td className="px-2 sm:px-4 py-2">-</td>
                  <td className="px-2 sm:px-4 py-2 text-center">No</td>
                  <td className="px-2 sm:px-4 py-2 rounded-r-xl">-</td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className="bg-gray-50 hover:bg-blue-50 transition rounded-xl shadow-sm">
                    <td className="px-2 sm:px-4 py-2 font-mono text-xs sm:text-sm text-gray-700 rounded-l-xl">{report.id}</td>
                    <td className="px-2 sm:px-4 py-2 text-gray-900 break-words max-w-[120px] md:max-w-xs">{report.username}</td>
                    <td className="px-2 sm:px-4 py-2 text-gray-900">{report.type}</td>
                    <td className="px-2 sm:px-4 py-2 text-center">{report.sent_to_email ? 'Yes' : 'No'}</td>
                    <td className="px-2 sm:px-4 py-2 text-gray-700 rounded-r-xl whitespace-nowrap">{formatDate(report.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReportDashboardView; 