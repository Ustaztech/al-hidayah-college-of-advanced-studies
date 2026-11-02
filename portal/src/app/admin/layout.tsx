'use client';

import React from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayoutWrapper({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F4F6F5] flex flex-col md:flex-row">
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
}
