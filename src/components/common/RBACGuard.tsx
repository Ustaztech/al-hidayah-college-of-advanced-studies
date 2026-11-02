import React from 'react';
import { useAuth, UserRole, Permission } from '../../context/AuthContext';
import { getRoleMetadata } from '../../services/rbac';
import { Lock, ShieldAlert } from 'lucide-react';

interface RequireRoleProps {
  roles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RequireRole: React.FC<RequireRoleProps> = ({ roles, children, fallback = null }) => {
  const { hasAnyRole } = useAuth();
  if (!hasAnyRole(roles)) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
};

interface RequirePermissionProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RequirePermission: React.FC<RequirePermissionProps> = ({
  permission,
  children,
  fallback = null
}) => {
  const { hasPermission } = useAuth();
  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
};

interface RoleBadgeProps {
  role: UserRole | string;
  size?: 'sm' | 'md' | 'lg';
  showDepartment?: boolean;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({
  role,
  size = 'md',
  showDepartment = false
}) => {
  const meta = getRoleMetadata(role);
  
  const sizeClasses = {
    sm: 'text-[9px] px-1.5 py-0.2',
    md: 'text-[10px] px-2.5 py-0.5',
    lg: 'text-xs px-3 py-1'
  }[size];

  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={`font-black uppercase tracking-wider rounded-md border shadow-2xs ${sizeClasses} ${meta.badgeColor}`}
      >
        {meta.label}
      </span>
      {showDepartment && (
        <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
          ({meta.department})
        </span>
      )}
    </div>
  );
};
