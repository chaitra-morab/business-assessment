import React from 'react';
import { Menu, ChevronDown, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface HeaderBarProps {
    pageTitle: string;
    toggleSidebar: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ pageTitle, toggleSidebar }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownOpen]);

    return (
        <div className="flex items-center justify-between p-4 bg-white shadow-lg rounded-xl mb-6">
            <button className="lg:hidden text-gray-700 hover:text-gray-900 transition-colors" onClick={toggleSidebar}>
                <Menu size={28} />
            </button>
            <h1 className="text-3xl font-bold text-blue-600 ml-4 lg:ml-0">{pageTitle}</h1>
            <div className="relative flex items-center" ref={dropdownRef}>
                <div className="flex items-center cursor-pointer select-none" onClick={() => setDropdownOpen((v) => !v)}>
                    <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl mr-2 border-2 border-blue-300">
                        <User size={28} />
                    </span>
                    <span className="font-semibold text-gray-700 hidden md:inline">Admin</span>
                    <ChevronDown size={22} className="ml-1 text-gray-500" />
                </div>
                {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 animate-fade-in-up">
                        <form className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">Name</label>
                                <input type="text" value="admin" readOnly className="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-gray-700 font-medium" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
                                <input type="email" value="admin@gmail.com" readOnly className="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-gray-700 font-medium" />
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeaderBar; 