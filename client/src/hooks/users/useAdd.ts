import { addUser } from "../../services/users";
import { TPAddUsers } from "../../types/types";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";
export const useUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user: TPAddUsers) => addUser(user),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey:['users']});
            toast.success('Usuário adicionado com sucesso');
        },
        onError: () => toast.error('Não foi possível adicionar o usuário')
    });
}