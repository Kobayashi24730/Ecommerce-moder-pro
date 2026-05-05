import { addUser } from "../../services/users";
import { TPAddUsers } from "../../types/types";
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user: TPAddUsers) => addUser(user),
        onSuccess: () => queryClient.invalidateQueries({ queryKey:['users']}),
        onError: () => alert('Não foi possível adicionar o usuário')
    });
}