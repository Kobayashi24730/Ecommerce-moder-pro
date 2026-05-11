import { handleRead } from "@/services/users";
import { TPNitifyUser } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
export const useRead = () => {
    const queryclient = useQueryClient();
    const { setUser } = useAuth();
    return useMutation({
        mutationFn: (user: TPNitifyUser) => handleRead(user),
        onMutate: async (newData) => {
            setUser((prevUser) => {
                if(!prevUser) return prevUser;
                return {
                    ...prevUser,
                    notifications: prevUser.notifications?.map((n: any) => 
                        n.id === newData.id
                        ? { ...newData, read: n.read}
                        : n
                    )
                };
            });
        },
        onSuccess: () => { 
            queryclient.invalidateQueries({ queryKey: ['users'] });
            toast.success('Notificação marcada como lida', {
                description: 'A notificação foi marcada como lida.',
            });
        },
        onError: (err,newData, context) => {
            if(context?.previounsUser) {
                queryclient.setQueryData(['users'], context.previounsUser);
            }
            toast.error('Não foi possível marcar a notificação como lida');
        }
    });
}