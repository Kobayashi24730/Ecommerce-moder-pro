import { useQuery } from '@tanstack/react-query';
import { get } from '@/services/products';
import { TPProduct } from '@/types/types';
import { products as MockProduct } from '@/data/mockProducts';
export const useGet = () => {
    return useQuery<TPProduct[]>({
        queryKey: ['products'],
        queryFn: get,
        retry: 1,
        staleTime: 1000 * 60 * 5,
        select: (data): TPProduct[] => {
            if(!data || data.length === 0){
                return MockProduct as unknown as TPProduct[];
            }
            return data;
        }
    });
}