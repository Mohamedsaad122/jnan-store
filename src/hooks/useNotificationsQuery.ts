import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardNotificationService } from '@/features/dashboard/services/notification.service';
import { queryKeys } from '@/lib/react-query/queryKeys';
import { NotificationItem } from '@/store/notification.store';
import { toast } from 'react-hot-toast';

export const useNotifications = () => {
  return useQuery<NotificationItem[]>({
    queryKey: queryKeys.notifications,
    queryFn: () => dashboardNotificationService.fetchNotifications(),
    staleTime: 2 * 60 * 1000, // 2 minutes cache freshness
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dashboardNotificationService.updateReadStatus(id, true),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications });
      const previousNotifications =
        queryClient.getQueryData<NotificationItem[]>(queryKeys.notifications) || [];

      const updatedList = previousNotifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );

      queryClient.setQueryData(queryKeys.notifications, updatedList);

      return { previousNotifications };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(queryKeys.notifications, context.previousNotifications);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => dashboardNotificationService.markAllAsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications });
      const previousNotifications =
        queryClient.getQueryData<NotificationItem[]>(queryKeys.notifications) || [];

      const updatedList = previousNotifications.map((n) => ({ ...n, read: true }));

      queryClient.setQueryData(queryKeys.notifications, updatedList);

      return { previousNotifications };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(queryKeys.notifications, context.previousNotifications);
      }
      toast.error('فشل تحديد الكل كمقروء');
    },
    onSuccess: () => {
      toast.success('تم تحديد جميع التنبيهات كمقروءة');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dashboardNotificationService.deleteNotification(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications });
      const previousNotifications =
        queryClient.getQueryData<NotificationItem[]>(queryKeys.notifications) || [];

      const updatedList = previousNotifications.filter((n) => n.id !== id);

      queryClient.setQueryData(queryKeys.notifications, updatedList);

      return { previousNotifications };
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(queryKeys.notifications, context.previousNotifications);
      }
      toast.error(error.message || 'فشل حذف التنبيه');
    },
    onSuccess: () => {
      toast.success('تم حذف التنبيه بنجاح');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
    },
  });
};
