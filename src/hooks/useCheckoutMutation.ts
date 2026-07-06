import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersService, CreateOrderParams } from '@/services/orders/orders.service';
import { useCartStore } from '@/store/cart.store';
import { queryKeys } from '@/lib/react-query/queryKeys';
import { toast } from 'react-hot-toast';

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const clearCart = useCartStore((s) => s.clearCart);

  return useMutation({
    mutationFn: (orderData: CreateOrderParams) => ordersService.createOrder(orderData),
    onSuccess: (data) => {
      // Store checkout result in local storage for details page mock lookup if needed
      localStorage.setItem('jnan_last_order', JSON.stringify(data));

      // Wipe cart
      clearCart();

      // Invalidate dashboard orders lists
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.list(data.userId) });

      toast.success('تم تسجيل طلبك بنجاح!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'فشل إرسال طلب الشراء. يرجى مراجعة البيانات.');
    },
  });
};

export default useCreateOrder;
