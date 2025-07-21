'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Home, BarChart2, User, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '@/client'; // adjust path if needed

const menuItems = [
  { label: 'Home', icon: <Home size={20} />, link: '/' },
  { label: 'Progress Report', icon: <BarChart2 size={20} />, link: '/dashboard/progress' },
  { label: 'Profile', icon: <User size={20} />, link: '/dashboard/profile' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await fetch('/api/auth/session', { method: 'DELETE' }); // optional if you also want to clear session cookie
            router.push('/');

    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className={`h-screen bg-[#0f172a] text-white shadow-xl transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Toggle button */}
      <div className="flex justify-end p-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white focus:outline-none"
        >
          {collapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>
      </div>

      {/* Menu items */}
      <nav className="flex flex-col space-y-2 px-4">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.link}
            className="flex items-center space-x-4 hover:bg-[#1e293b] p-3 rounded-lg transition-colors"
          >
            {item.icon}
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
          </Link>
        ))}

         <button
          onClick={handleLogout}
          className="flex items-center space-x-4 hover:bg-[#1e293b] p-3 rounded-lg transition-colors text-left w-full"
        >
          <LogOut size={20} />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
      </nav>

      {/* Logout - stick to bottom */}
      {/* <div className="absolute bottom-6 left-0 w-full px-4">
        <Link
          href="/logout"
          className="flex items-center space-x-4 hover:bg-[#1e293b] p-3 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </Link>
      </div> */}
    </div>
  );
}