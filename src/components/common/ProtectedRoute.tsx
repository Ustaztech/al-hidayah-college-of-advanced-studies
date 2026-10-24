import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { currentUser, role } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-xl border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-900 font-serif">Access Restricted</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your current account role (<strong className="font-mono text-emerald-800">{role}</strong>) does not have clearance to view this administrative sector.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/signin"
              className="px-5 py-2.5 bg-[#006B35] text-white font-extrabold rounded-xl text-xs shadow-md"
            >
              Sign in with Authorized Account
            </Link>
            <Link
              to="/"
              className="px-5 py-2 text-slate-600 hover:text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
