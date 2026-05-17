import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddressToStandard } from '@/services/users.ts';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext'

export const useStanded = () => {
    const queryclient = useQueryClient();
    const { setUser } = useAuth();
    return useMutation({
        mutationFn: (id: number) => AddressToStandard(id),
        onMutate: async (newData) => {
            await queryclient.cancelQueries({ queryKey: ['users'] });
            const provideus = queryclient.getQueryData(['users']);
            setUser((prevUser) => {
                if(!prevUser) return;
                return {
                    ...prevUser,
                    addresses: prevUser.addresses.map((n: any) => ({
                        ...n,
                        isDefault: n.id === newData ? 1 : 0
                    }))
                };
            });
        },
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: ['address'] });
            toast.success('Address atualizada', {description: 'Address definido como padrão!'})
        },
        onError: () => toast.error('Erro ao definir address como padão!')
    });
}