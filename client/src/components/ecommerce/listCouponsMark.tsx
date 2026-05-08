import { useAuth } from "@/contexts/AuthContext";
export default function ListCouponsMark() {
    const { user } = useAuth();
    const data = user ? user : null;
    const coupons = data?.coupons || [];
    return (
        <div>
            {coupons.length > 0 ? (
                coupons.map((c) => (
                    <div key={c.id} className="p-4 bg-green-100 border border-green-300 rounded mb-2">
                        <p className="text-sm text-green-800">Cupom: {c.code} - Status: {c.status_id == 1 ? 'Usado' : 'Não Usado'}</p>
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