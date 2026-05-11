import { handleRead } from "@/services/users";
import { TPNitifyUser } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
export const useRead = () => {
    const queryclient = useQueryClient();
    const { user, setUser } = useAuth();
    return useMutation({
        mutationFn: (user: TPNitifyUser) => handleRead(user),
        onMutate: async (newData) => {
            const previounsUser = user;
            setUser((prevUser) => {
                if(!prevUser) return prevUser;
                const courentNofication = prevUser.notifications || [];
                const status = Number(newData.read) === 0 ? 1 : 0;
                return {
                    ...prevUser,
                    notifications: courentNofication.map((n: any) => 
                        n.id === newData.id
                        ? { ...n, read: status}
                        : n
                    )
                };
            });
            return { previounsUser };
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