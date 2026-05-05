import { handleRead } from "@/services/users";
import { TPNitifyUser } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRead = () => {
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn: (user: TPNitifyUser) => handleRead(user),
        onSuccess: () => queryclient.invalidateQueries({ queryKey: ['users'] }),
        onError: () => alert('Não foi possível marcar a notificação como lida')
    });
}