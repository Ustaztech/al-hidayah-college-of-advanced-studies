import React, { createContext, useContext, useState, useEffect } from 'react';
import { InstitutionalNotification } from '../types';
import {
  getStoredNotifications,
  saveNotifications,
  filterNotificationsForRole
} from '../services/notifications';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: InstitutionalNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (
    notif: Omit<InstitutionalNotification, 'id' | 'created_at' | 'read'>
  ) => void;
  clearNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role } = useAuth();
  const [allNotifications, setAllNotifications] = useState<InstitutionalNotification[]>(() =>
    getStoredNotifications()
  );

  useEffect(() => {
    saveNotifications(allNotifications);
  }, [allNotifications]);

  const activeRoleNotifications = filterNotificationsForRole(allNotifications, role as any);
  const unreadCount = activeRoleNotifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setAllNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setAllNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const addNotification = (
    notif: Omit<InstitutionalNotification, 'id' | 'created_at' | 'read'>
  ) => {
    const newEntry: InstitutionalNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      created_at: new Date().toISOString(),
      read: false
    };
    setAllNotifications(prev => [newEntry, ...prev]);
  };

  const clearNotification = (id: string) => {
    setAllNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications: activeRoleNotifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        clearNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
