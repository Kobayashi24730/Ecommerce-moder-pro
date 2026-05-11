import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCartQuantity } from "@/services/cart";
import { toast } from 'sonner';

// No seu onSuccess da mutação:
export const useUp = () => {
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn: ({ productId, quantity } : { productId: number, quantity: number }) => updateCartQuantity({ productId, quantity }),
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: ['cart'] });
            toast.success("Quantidade do produto atualizada com sucesso!", {
                description: 'A quantidade foi alterada.',
            });
        },
        onError: () => {
            toast.error("Erro ao atualizar a quantidade do produto. Tente novamente.", {
                description: 'Não foi possível atualizar a quantidade.',
            });
        },
        onMutate: async (newData) => {
            await queryclient.cancelQueries({ queryKey: ['cart'] });
            const previousCart = queryclient.getQueryData(['cart']);
            queryclient.setQueryData(['cart'], (old: any) => {
                return {
                    ...old,
                    items: old.items.map((item: any) => 
                        item.product_id === newData.productId
                        ? { ...item, quantity: newData.quantity}
                        : item
                    )
                }
            });
        }
    });
}