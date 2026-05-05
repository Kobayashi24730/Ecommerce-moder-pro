import { Mutation, useMutation, useQueryClient } from '@tanstack/react-query';
import { submitProfile } from '@/services/users';
import { User } from '@/types/types';
export const useInfos = () => {
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn: (user: User) => submitProfile(user),
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: ['users']});
            alert('Informações atualizadas com sucesso');
        },
        onError: () => alert('Não foi possível confirmar o usuário')
    });
};