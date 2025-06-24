import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Power, UserCircle } from 'lucide-react';
import React from 'react';

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
}

const Header: React.FC<HeaderProps> = ({ userName, userAvatar }) => {
  const router = useRouter();

  const handleLogout = (): void => {
    localStorage.removeItem('jwt_token');
    console.log('Logging out...');
    router.push('/admin'); // Redirect to admin login page
  };

  return (
    <header className="bg-white shadow-sm p-4 flex items-center justify-between fixed top-0 left-0 right-0 z-10 md:px-8 rounded-b-lg">
      {/* Brand Logo / Title */}
      <div className="flex items-center">
        {/* Using a placeholder image; replace with your actual logo */}
        <Image src="https://placehold.co/32x32/3b82f6/ffffff?text=LOGO" alt="Brand Logo" width={32} height={32} className="mr-2 rounded-full" />
        <h1 className="text-xl font-semibold text-gray-800 hidden sm:block font-inter">Admin Dashboard</h1>
      </div>

      {/* User Info & Logout */}
      <div className="flex items-center space-x-4">
        {userName && (
          <div className="flex items-center space-x-2">
            {userAvatar ? (
              <Image src={userAvatar} alt="User Avatar" width={32} height={32} className="rounded-full border-2 border-blue-400" />
            ) : (
              <UserCircle className="text-gray-500 rounded-full bg-gray-200 p-1" size={32} />
            )}
            <span className="text-gray-700 font-medium hidden md:block font-inter">{userName}</span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors duration-200 shadow-md flex items-center justify-center"
          title="Logout"
        >
          <Power size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header; 