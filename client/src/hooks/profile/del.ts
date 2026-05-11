import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { delNotificationFromUser } from "../../services/users";
export const useDel = () => {
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => delNotificationFromUser(id),
        onSuccess: () => toast.success('Usuário excluido com sucesso!') && queryclient.invalidateQueries({ queryKey: ['users'] }),
        onError: () => toast.error('Erro ao excluir o usuário!'),
    });
}