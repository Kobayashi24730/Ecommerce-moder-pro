import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleStatusCoupon } from "@/services/users";
import type { TPcouponStatusUser } from "@/types/types";
export const useStatus = () => {
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn: (user: TPcouponStatusUser)  => handleStatusCoupon(user),
        onSuccess: () => queryclient.invalidateQueries({ queryKey: ['users'] }),
        onError: () => alert('Não foi possível confirmar o usuário')
    });
}