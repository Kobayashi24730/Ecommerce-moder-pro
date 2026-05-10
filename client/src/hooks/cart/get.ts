import { useQuery } from "@tanstack/react-query";
import { getCartAPI } from "@/services/cart";
import { TPProduct } from "@/types/types";
export const useGet = () => {
    return useQuery({
        queryKey: ["cart"],
        queryFn: getCartAPI,
        retry: 1,
    });
}