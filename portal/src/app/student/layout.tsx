'use client';

import React, { useState } from 'react';
import { PortalHeader } from '../../components/layout/PortalHeader';
import { PortalSidebar } from '../../components/layout/PortalSidebar';
import { AuthSessionUser } from '../../lib/types';

interface StudentLayoutProps {
  children: React.ReactNode;
}

export default function StudentLayoutWrapper({ children }: StudentLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // In Next.js App Router, layout child receives server data, or can wrap
  return (
    <div className="min-h-screen bg-[#F4F6F5] flex flex-col md:flex-row">
      {/* We mount the sidebar and main content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
}
