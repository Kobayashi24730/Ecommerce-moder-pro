import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleStatusCoupon } from "@/services/users";
import type { TPcouponStatusUser } from "@/types/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
export const useStatus = () => {
    const { setUser } = useAuth();
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn: (user: TPcouponStatusUser)  => handleStatusCoupon(user),
        onMutate: async (newData) => {
            await queryclient.cancelQueries({ queryKey: ['users'] });
            let previounsUser: any;
            setUser((prevUser: any) => {
                if(!prevUser) return prevUser;
                const courrentCoupons = prevUser.coupons.map((c: any) => {
                    if(c.id === newData.id){
                        return {
                            ...c,
                            status_id: newData.status_id,
                            email: newData.email,
                            name: newData.name
                        };
                    }
                    return c;
                })
                return {
                    ...prevUser,
                    coupons: courrentCoupons
                }
            });
            return { previounsUser }; 
        },
        onSuccess: () => { 
            queryclient.invalidateQueries({ queryKey: ['users'] });
            toast.success('Status do cupom atualizado', {
                description: 'O status do cupom foi atualizado com sucesso.',
            });
         },
        onError: (err, user, context) => {
            toast.error('Não foi possível confirmar o usuário');
            if(context?.previounsUser){
                queryclient.setQueriesData({ queryKey: ['users'] }, context.previounsUser);
            }
        }
    });
}