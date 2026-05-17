import { DelAddress } from '../../services/users.ts';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
export const useDelAdress = () => {
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => DelAddress(id),
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: ['address']})
            toast.success('message', {
                description: 'Address deletado com sucesso!'
            });
        },
        onError: () => toast.error('Erro ao deletar address!')
    });
}