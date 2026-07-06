import React from 'react';
import { NotificationItem } from '@/store/notification.store';
import NotificationCard from './NotificationCard';
import EmptyNotificationState from './EmptyNotificationState';

interface NotificationListProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  isRtl: boolean;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onMarkAsRead,
  onDelete,
  isRtl,
}) => {
  if (notifications.length === 0) {
    return <EmptyNotificationState />;
  }

  return (
    <div className="space-y-4">
      {notifications.map((n) => (
        <NotificationCard
          key={n.id}
          notification={n}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
          isRtl={isRtl}
        />
      ))}
    </div>
  );
};

export default NotificationList;
