import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth, UserRole, Permission } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, LogIn, Lock, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';
import { getRoleMetadata } from '../../services/rbac';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermission?: Permission;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requiredPermission
}) => {
  const { currentUser, role, isAuthorized, roleMetadata } = useAuth();
  const location = useLocation();

  // 1. Not Authenticated -> Redirect to Sign In with return location state
  if (!currentUser) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // 2. Authorization Check (Roles & Granular Permissions)
  const authorized = isAuthorized(allowedRoles, requiredPermission);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4 selection:bg-[#196855] selection:text-white transition-colors">
        <div className="bg-white dark:bg-slate-900 max-w-lg w-full p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-6 animate-fade-in">
          
          {/* Shield Restricted Emblem */}
          <div className="relative mx-auto w-20 h-20">
            <div className="w-20 h-20 rounded-3xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shadow-inner">
              <ShieldAlert size={40} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow">
              <Lock size={14} />
            </div>
          </div>

          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 block mb-1">
              403 Forbidden • Access Restricted
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white font-serif">
              Institutional Clearance Required
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              You are signed in, but your account clearance does not grant permission to view or manage this administrative sector.
            </p>
          </div>

          {/* Current Identity Box */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-left space-y-2 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 font-medium">Active User:</span>
              <strong className="text-slate-900 dark:text-white">{currentUser.name}</strong>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 font-medium">Assigned Role:</span>
              <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${roleMetadata.badgeColor}`}>
                {roleMetadata.label} ({role})
              </span>
            </div>
            {allowedRoles && (
              <div className="flex justify-between items-start pt-1">
                <span className="text-slate-500 font-medium">Required Roles:</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold text-[11px] text-right">
                  {allowedRoles.join(', ')}
                </span>
              </div>
            )}
            {requiredPermission && (
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-500 font-medium">Required Permission:</span>
                <span className="font-mono text-amber-600 dark:text-amber-400 font-bold text-[10px]">
                  {requiredPermission}
                </span>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              to={roleMetadata.portalHome || '/'}
              className="w-full py-3 px-4 bg-[#196855] hover:bg-[#145646] text-white font-extrabold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Go to My Authorized Workspace</span>
              <ArrowRight size={14} />
            </Link>

            <Link
              to="/signin"
              state={{ from: location }}
              className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
            >
              <LogIn size={14} />
              <span>Sign In with Different Account</span>
            </Link>

            <Link
              to="/"
              className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 pt-1"
            >
              <ArrowLeft size={13} />
              <span>Back to Campus Homepage</span>
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // 3. Authorized -> Render protected route content
  return <>{children}</>;
};

export default ProtectedRoute;
