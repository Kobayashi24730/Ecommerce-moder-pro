import { forgotUser } from "@/services/users";
import { TPForgetUser } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
export const useForget = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user: TPForgetUser) => forgotUser(user),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('Email enviado com sucesso', { description: 'O email foi enviado com sucesso.' });
        }
    });
}