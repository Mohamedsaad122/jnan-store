import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addressesService } from '@/services/addresses/addresses.service';
import { queryKeys } from '@/lib/react-query/queryKeys';
import { Address } from '@/types/domain';
import { toast } from 'react-hot-toast';

export const useAddresses = () => {
  return useQuery<Address[]>({
    queryKey: queryKeys.addresses,
    queryFn: () => addressesService.getAddresses(),
    staleTime: 10 * 60 * 1000, // 10 minutes cache freshness
  });
};

export const useAddAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newAddr: Omit<Address, 'id' | 'userId'>) => addressesService.addAddress(newAddr),
    onMutate: async (newAddr) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.addresses });
      const previousAddresses = queryClient.getQueryData<Address[]>(queryKeys.addresses) || [];

      const tempId = `addr-temp-${Date.now()}`;
      const optimisticAddress: Address = {
        ...newAddr,
        id: tempId,
        userId: 'mock-user-123',
      };

      let updatedList = [...previousAddresses];
      if (optimisticAddress.isDefault) {
        updatedList = updatedList.map((addr) => ({ ...addr, isDefault: false }));
      }
      if (updatedList.length === 0) {
        optimisticAddress.isDefault = true;
      }
      updatedList.push(optimisticAddress);

      queryClient.setQueryData(queryKeys.addresses, updatedList);

      return { previousAddresses };
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousAddresses) {
        queryClient.setQueryData(queryKeys.addresses, context.previousAddresses);
      }
      toast.error(error.message || 'فشل إضافة العنوان');
    },
    onSuccess: () => {
      toast.success('تم إضافة العنوان بنجاح');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses });
    },
  });
};

export const useEditAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updatedFields }: { id: string; updatedFields: Partial<Address> }) =>
      addressesService.editAddress(id, updatedFields),
    onMutate: async ({ id, updatedFields }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.addresses });
      const previousAddresses = queryClient.getQueryData<Address[]>(queryKeys.addresses) || [];

      const updatedList = previousAddresses.map((addr) => {
        if (addr.id === id) {
          return { ...addr, ...updatedFields };
        }
        if (updatedFields.isDefault) {
          return { ...addr, isDefault: false };
        }
        return addr;
      });

      const hasDefault = updatedList.some((addr) => addr.isDefault);
      if (!hasDefault && updatedList.length > 0) {
        updatedList[0].isDefault = true;
      }

      queryClient.setQueryData(queryKeys.addresses, updatedList);

      return { previousAddresses };
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousAddresses) {
        queryClient.setQueryData(queryKeys.addresses, context.previousAddresses);
      }
      toast.error(error.message || 'فشل تحديث العنوان');
    },
    onSuccess: () => {
      toast.success('تم تحديث العنوان بنجاح');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses });
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => addressesService.deleteAddress(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.addresses });
      const previousAddresses = queryClient.getQueryData<Address[]>(queryKeys.addresses) || [];

      const target = previousAddresses.find((addr) => addr.id === id);
      const updatedList = previousAddresses.filter((addr) => addr.id !== id);

      if (target?.isDefault && updatedList.length > 0) {
        updatedList[0] = { ...updatedList[0], isDefault: true };
      }

      queryClient.setQueryData(queryKeys.addresses, updatedList);

      return { previousAddresses };
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousAddresses) {
        queryClient.setQueryData(queryKeys.addresses, context.previousAddresses);
      }
      toast.error(error.message || 'فشل حذف العنوان');
    },
    onSuccess: () => {
      toast.success('تم حذف العنوان بنجاح');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses });
    },
  });
};

export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => addressesService.setDefaultAddress(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.addresses });
      const previousAddresses = queryClient.getQueryData<Address[]>(queryKeys.addresses) || [];

      const updatedList = previousAddresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }));

      queryClient.setQueryData(queryKeys.addresses, updatedList);

      return { previousAddresses };
    },
    onError: (error: Error, _variables, context) => {
      if (context?.previousAddresses) {
        queryClient.setQueryData(queryKeys.addresses, context.previousAddresses);
      }
      toast.error(error.message || 'فشل تعيين العنوان كافتراضي');
    },
    onSuccess: () => {
      toast.success('تم تعيين العنوان الافتراضي بنجاح');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses });
    },
  });
};
