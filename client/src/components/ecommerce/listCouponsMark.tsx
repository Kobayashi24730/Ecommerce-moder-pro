import { useAuth } from "@/contexts/AuthContext";
import { useStatusUser } from "@/hooks/index";
export default function ListCouponsMark() {
    const { user } = useAuth();
    const data = user ? user : null;
    const coupons = data?.coupons || [];
    const { mutate } = useStatusUser();

    function setCouponToUse(couponID: number, status: number){
        if(!couponID){
            console.log('ID do cupom não encontrado');
            return;
        }
        const courrentStatus = status === 1 ? 0 : 1;
        mutate({ 
            id: couponID,
            status_id: courrentStatus,
            email: data.email,
            name: data.name
        },{
            onSuccess: () => alert('Cupom atualizado com sucesso!'),
            onError: () => alert('Não foi possível atualizar o cupom.')
        });  
    }
    return (
        <div>
            {coupons.length > 0 ? (
                coupons.map((c) => (
                    <div key={c.id} className="p-4 bg-green-100 border border-green-300 rounded mb-2">
                        <p>Cupom: {c.code} </p> 
                        <p>Status: {c.status_id == 1 ? 'Usado' : 'Não Usado'}</p>
                        <button
                            className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                            onClick={() => setCouponToUse(c.id, c.status_id)}
                        >{ Number(c.status_id) == 1 ? 'usar' : 'usado'}</button>
                    </div>
                ))
            ) : (
                <div>
                    <p className="text-sm text-muted-foreground">Você não possui cupons disponíveis no momento.</p>
                </div>
            )}
        </div>
    );
}