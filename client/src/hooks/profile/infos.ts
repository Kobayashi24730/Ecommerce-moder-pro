import { Mutation, useMutation, useQueryClient } from '@tanstack/react-query';
import { submitProfile } from '@/services/users';
import { User } from '@/types/types';
import { toast } from 'sonner';
export const useInfos = () => {
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn: (user: User) => submitProfile(user),
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: ['users']});
            toast.success('Informações atualizadas com sucesso', {
                description: 'Seus dados foram atualizados.',
            });
        },
        onError: () => toast.error('Não foi possível confirmar o usuário'),
        onMutate: async (newData) => {
            await queryclient.cancelQueries({ queryKey: ['users'] });
            const previounsUser = queryclient.getQueryData(['users']);
            queryclient.setQueryData(['user'], (old: any) => {
                return {
                    ...old,
                    name: newData.name,
                    email: newData.email,
                    phone: newData.phone,
                    preferences: newData.preferences,
                    birthDate: newData.birthDate,
                    avatar: newData.avatar,
                    cpf: newData.cpf,
                    twoFactorEnabled: newData.twoFactorEnabled,
                    emailVerifiedAt: newData.emailVerifiedAt,
                    createdAt: newData.createdAt,
                    updatedAt: newData.updatedAt,
                    defaultAddressId: newData.defaultAddressId,
                    addresses: newData.addresses,
                    defaultPaymentMethodId: newData.defaultPaymentMethodId,
                    paymentMethods: newData.paymentMethods
                }
            });
        }
    });
};