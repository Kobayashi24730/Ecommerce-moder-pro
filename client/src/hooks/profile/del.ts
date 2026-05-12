import { toast } from "sonner";
import { keepPreviousData, useMutation, useQueryClient } from "@tanstack/react-query";
import { delNotificationFromUser } from "../../services/users";
import { useAuth } from "@/contexts/AuthContext";
export const useDel = () => {
    const { setUser } = useAuth();
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => delNotificationFromUser(id),
        onMutate: async (idToDelete) => {
            let previounsUser: any;
            await queryclient.cancelQueries({ queryKey: ['users'] });
            setUser((prevUser: any) => {
                if (!prevUser) return prevUser;
                previounsUser = prevUser;
                const notifacationsNow = prevUser.notifications.filter((n: any) => n.id !== idToDelete);
                return {
                    ...prevUser,
                    notifications: notifacationsNow
                }
            });
            return { previounsUser };
        },
        onSuccess: () => toast.success('Usuário excluido com sucesso!') && queryclient.invalidateQueries({ queryKey: ['users'] }),
        onError: (err, id, context) => {
            toast.error('Não foi possível excluir o usuário');
            if(context?.previounsUser){
                queryclient.setQueryData(['users'], context.previounsUser);
            }
        }
    });
}