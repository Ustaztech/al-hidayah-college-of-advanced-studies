import { InstitutionalNotification, InstitutionalRole } from '../types';

const NOTIFICATIONS_STORAGE_KEY = 'ahcas_clean_prod_v1_notifications';

const INITIAL_NOTIFICATIONS: InstitutionalNotification[] = [
  {
    id: 'notif-001',
    target_role: 'ALL',
    title: 'Welcome to AHCAS Digital Campus',
    message: 'Welcome to the unified Al-Hidayah College of Advanced Studies digital platform. All portal features and official academic services are now active.',
    category: 'System',
    priority: 'high',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    read: false,
    action_url: '/'
  },
  {
    id: 'notif-002',
    target_role: 'STUDENT',
    title: 'IJMB Continuous Assessment Reminder',
    message: 'Continuous Assessment (CA) submission for the 1st Semester 2026/2027 session is currently being processed by the Examination Directorate.',
    category: 'Examinations',
    priority: 'normal',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    read: false,
    action_url: '/student/dashboard?tab=results'
  },
  {
    id: 'notif-003',
    target_role: 'APPLICANT',
    title: 'Admission Credentials Verification',
    message: 'Please ensure your uploaded WAEC/NECO/NABTEB O\'Level statement and scratch card credentials are submitted for registrar verification.',
    category: 'Admissions',
    priority: 'urgent',
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    read: false,
    action_url: '/apply'
  },
  {
    id: 'notif-004',
    target_role: 'COUNCIL_MEMBER',
    title: 'Governing Council Boardroom Papers',
    message: 'Quarterly institutional performance metrics and strategic plan progress papers have been published to the confidential repository.',
    category: 'Council',
    priority: 'high',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    read: false,
    action_url: '/admin/dashboard'
  }
];

export const getStoredNotifications = (): InstitutionalNotification[] => {
  const data = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
};

export const saveNotifications = (notifs: InstitutionalNotification[]): void => {
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifs));
};

export const sendNotification = (notification: {
  recipient_id?: string;
  recipient_role?: string;
  target_role?: string;
  title: string;
  message: string;
  type?: string;
  category?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  action_url?: string;
}): void => {
  const current = getStoredNotifications();
  const newNotif: InstitutionalNotification = {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    target_role: (notification.target_role || notification.recipient_role || 'ALL') as any,
    title: notification.title,
    message: notification.message,
    category: (notification.category || notification.type || 'Academic') as any,
    priority: notification.priority || 'normal',
    created_at: new Date().toISOString(),
    read: false,
    action_url: notification.action_url || '/'
  };
  current.unshift(newNotif);
  saveNotifications(current);
};

export const filterNotificationsForRole = (
  notifs: InstitutionalNotification[],
  role: InstitutionalRole | 'GUEST'
): InstitutionalNotification[] => {
  if (role === 'SUPER_ADMIN') return notifs;
  return notifs.filter(
    n => n.target_role === 'ALL' || n.target_role === (role as InstitutionalRole)
  );
};
