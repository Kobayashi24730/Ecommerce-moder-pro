import {CreditCard, QrCode, Receipt} from "lucide-react";

type Props = {
    method: string;
};
export default function PaymentMethod({method}: Props){
    const useMetude = String(method);

    const card = () => {
        switch(method) {
            case "credit_card":
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-6 w-6" />
                            <h2 className="text-xl font-bold">Cartão de Crédito</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                className="border rounded p-2"
                                placeholder="Nome do titular"
                            />
                            <input
                                className="border rounded p-2"
                                placeholder="Número do cartão"
                            />
                            <input
                                className="border rounded p-2"
                                placeholder="MM/AA"
                            />
                            <input
                                className="border rounded p-2"
                                placeholder="CVV"
                            />
                        </div>
                    </div>
                );
            case "pix":
                return (
                    <div className="mt-6 border rounded-xl p-6 bg-muted/30">
                        <div className="flex items-center gap-2 mb-4">
                            <QrCode className="h-5 w-5"/>
                            <h3 className="font-bold text-lg">Pagamento via PIX.</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">Escaneie o QR Code abaixo para concluir o pagamento.</p>
                        <div className="w-52 h-52 border rounded-lg flex items-center justify-center mx-auto bg-background">QR CODE</div>
                        <button className="w-full mt-4 border rounded-lg p-3 hover:bg-muted transition">Copiar codigo PIX.</button>
                    </div>
                );
            case "boleto":
                return (
                    <div className="mt-6 border rounded-xl p-6 bg-muted/30">
                        <div className="flex items-center gap-2 mb-4">
                            <Receipt className="h-5 w-5"/>
                            <h3 className="font-bold text-lg">Pagamento via boleto</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">Gere o boleto báncario para pagamento.</p>
                        <button className="w-full bg-primary text-primary-foreground rounded-lg p-3 hover:opacity-90 transition">
                            Gerar boleto
                        </button>
                    </div>
                );
            default:
                return null;
        }
    }

    return(
        <>
            {card()}
        </>
    );
}