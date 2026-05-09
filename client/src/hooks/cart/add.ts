import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TPProduct } from "@/types/types";
import { addToCartAPI } from "@/services/cart";

export const useAdd = () => {
    const queryclient = useQueryClient();
    const mutation = useMutation({
        mutationFn: addToCartAPI,
        onSuccess: () => { queryclient.invalidateQueries({ queryKey: ["cart"] }) },
        onError: () => { alert("Não foi possível adicionar o produto ao carrinho") }
    });
    return mutation;
}