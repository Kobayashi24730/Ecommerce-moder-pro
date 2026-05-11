import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteToCart } from "@/services/cart";
import { toast } from "sonner";
export const useDel = () => {
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn: (productId: number) => deleteToCart({ productId }),
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: ['cart'] });
            toast.success("Produto removido do carrinho!", {
                description: 'O produto foi removido do seu carrinho.',
            });
        },
        onError: () => {
            toast.error("Erro ao remover item do carrinho");
        }
    });
}