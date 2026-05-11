import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TPProduct } from "@/types/types";
import { addToCartAPI } from "@/services/cart";
import { toast } from "sonner";

export const useAdd = () => {
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn: addToCartAPI,
        onSuccess: () => { 
            queryclient.invalidateQueries({ queryKey: ["cart"] });
            toast.success("Produto adicionado ao carrinho!", {
                description: 'O produto foi adicionado ao seu carrinho.',
            })
         },
        onError: () => { toast.error("Não foi possível adicionar o produto ao carrinho") }
    });
}