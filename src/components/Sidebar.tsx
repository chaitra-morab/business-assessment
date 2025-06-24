import React from 'react';
import { Home, ClipboardList, HelpCircle, X, Users, BarChart2 } from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isSidebarOpen, toggleSidebar }) => {
    const navItems = [
        { id: 'dashboardView', icon: Home, label: 'Dashboard' },
        { id: 'usersView', icon: Users, label: 'Users' },
        { id: 'submissionsView', icon: ClipboardList, label: 'Submissions' },
        { id: 'questionsView', icon: HelpCircle, label: 'Manage Questions' },
        {id:'reportView', icon:BarChart2, label:'Report View'}
    ];

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/';
    };

    return (
        <div className={`
            fixed lg:sticky top-0 left-0 h-screen w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-8 z-[1000] flex flex-col border-r border-gray-700 shadow-2xl
            transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 lg:static
        `} aria-label="Sidebar" tabIndex={isSidebarOpen ? 0 : -1}>
            <button className="lg:hidden absolute top-4 right-4 text-white hover:text-gray-300" onClick={toggleSidebar}>
                <X size={28} />
            </button>
            <h2 className="text-3xl font-extrabold text-cyan-400 text-center mb-10 mt-2 tracking-wide drop-shadow-lg">Admin Panel</h2>
            <ul className="flex-grow space-y-2">
                {navItems.map((item) => (
                    <li key={item.id}>
                        <a
                            href={`#${item.id}`}
                            onClick={() => {
                                onTabChange(item.id);
                                if (window.innerWidth <= 768) {
                                    toggleSidebar();
                                }
                            }}
                            className={`flex items-center p-3 rounded-xl text-lg font-medium transition-all duration-200 ${
                                activeTab === item.id ? 'bg-blue-700 text-white shadow-lg' : 'hover:bg-gray-700 hover:text-teal-300'
                            }`}
                        >
                            <item.icon size={20} className="mr-4" />
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>
            <button
                onClick={handleLogout}
                className="mt-8 w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl shadow-lg transition-all duration-200"
            >
                <span>Log Out</span>
            </button>
        </div>
    );
};

export default Sidebar; 