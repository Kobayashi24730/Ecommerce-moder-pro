import { forgotUser } from "@/services/users";
import { TPForgetUser } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useForget = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user: TPForgetUser) => forgotUser(user),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        }
    });
}