import React from 'react';

interface DashboardBodyProps {
  children: React.ReactNode;
}

const DashboardBody: React.FC<DashboardBodyProps> = ({ children }) => {
  return (
    <main className="flex-1 p-6 pt-24 md:pt-6 md:ml-64 bg-gray-50 min-h-screen font-inter"> {/* Adjusted padding-top for header */}
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </main>
  );
};

export default DashboardBody; 