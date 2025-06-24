import React from 'react';

interface KPICardProps {
    icon: React.ElementType;
    value: string | number;
    label: string;
}

const KPICard: React.FC<KPICardProps> = ({ icon: Icon, value, label }) => {
    return (
        <div className="bg-white p-7 rounded-2xl shadow-xl flex items-center justify-between transition-all duration-200 hover:scale-[1.02] transform hover:shadow-2xl">
            <Icon size={52} className="text-blue-500 mr-4" />
            <div className="text-right">
                <div className="text-4xl font-extrabold text-gray-800">{value}</div>
                <div className="text-lg text-gray-600">{label}</div>
            </div>
        </div>
    );
};

export default KPICard; 