'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, LogOut, User, Settings, Bell, Shield } from 'lucide-react';
import { AuthSessionUser } from '../../lib/types';
import { ROLE_DISPLAY_NAMES } from '../../lib/auth/roles';

interface PortalHeaderProps {
  user: AuthSessionUser;
  onToggleSidebar: () => void;
  portalTitle: string;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  user,
  onToggleSidebar,
  portalTitle
}) => {
  const primaryRole = user.roles[0] || 'student';

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-xs select-none">
      <div className="px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        
        {/* Left: Hamburger & Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Drawer"
          >
            <Menu size={20} />
          </button>

          <div>
            <h1 className="text-xs sm:text-sm font-black uppercase tracking-tight text-[#196855] font-serif leading-none">
              {portalTitle}
            </h1>
            <p className="text-[10px] text-gray-400 font-medium hidden sm:block mt-0.5">
              Al-Hidayah College of Advanced Studies
            </p>
          </div>
        </div>

        {/* Right: User Profile, Role Badge, Logout */}
        <div className="flex items-center gap-3">
          
          {/* Role Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] font-bold text-[#196855]">
            <Shield size={12} />
            <span>{ROLE_DISPLAY_NAMES[primaryRole] || primaryRole}</span>
          </div>

          {/* Quick Profile Link */}
          <Link
            href="/portal/profile"
            className="flex items-center gap-2 p-1 pl-2 rounded-xl hover:bg-gray-100 transition-colors group"
          >
            <div className="text-right hidden md:block">
              <span className="text-xs font-bold text-gray-800 block leading-tight group-hover:text-[#196855]">
                {user.profile.full_name}
              </span>
              <span className="text-[10px] text-gray-400 font-mono truncate max-w-[140px] block">
                {user.student?.matric_number || user.staff?.staff_number || user.email}
              </span>
            </div>

            <div className="w-8 h-8 rounded-full bg-[#196855] text-white flex items-center justify-center font-bold text-xs shadow-xs border border-emerald-700">
              {user.profile.full_name.charAt(0)}
            </div>
          </Link>

          {/* Settings Icon */}
          <Link
            href="/portal/settings"
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors hidden sm:block"
            title="Account Settings"
          >
            <Settings size={18} />
          </Link>

          {/* Logout Action Form */}
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
              title="Sign Out"
            >
              <LogOut size={18} />
              <span className="text-xs font-bold hidden lg:inline">Sign Out</span>
            </button>
          </form>

        </div>

      </div>
    </header>
  );
};
