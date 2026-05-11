import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleStatusCoupon } from "@/services/users";
import type { TPcouponStatusUser } from "@/types/types";
import { toast } from "sonner";
export const useStatus = () => {
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn: (user: TPcouponStatusUser)  => handleStatusCoupon(user),
        onSuccess: () => { 
            queryclient.invalidateQueries({ queryKey: ['users'] });
            toast.success('Status do cupom atualizado', {
                description: 'O status do cupom foi atualizado com sucesso.',
            });
         },
        onError: () => toast.error('Não foi possível confirmar o usuário')
    });
}