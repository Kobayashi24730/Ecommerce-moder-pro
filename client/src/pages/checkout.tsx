import { products as MockProduct } from '@/data/mockProducts';
import { useState } from 'react';
export default function Checkout() {
    const [showModal, setShowModal] = useState(false);
    const [ showModalCoupons, setShowModalCoupons] = useState(false);
    const [ showModalPagamento, setShowModalPagamento] = useState(null);

    function handleModalPagamento(tipo: string) {
        return (
            <div>
                <h2>Modal de pagamento</h2>
                <p>Modal de pagamento</p>
                <button onClick={() => setShowModal(false)}>Fechar</button>
            </div>
        );
    }
    return (
        <div>
            <div>
                <div>
                    <h2>Lista de products as MockProduct</h2>
                    <div>
                        <span><small>Tag</small>Empresa</span>
                        <button>conversar com a empresa</button>
                    </div>
                    <div>
                        <h2>Produto infos</h2>
                        <div>
                            <p>Quantidade: <p>12</p></p>
                            <p>Valor: <p>12</p></p>
                            <p>Valor total: <p>12</p></p>
                            
                        </div>
                        <button>Remover</button>
                    </div>
                </div>
                <h2>Entrega localização</h2>
                <div>
                    <h2>rua sao jose, francisco, vicentinho, paleminos</h2>
                    <p>enderesso expecifico<span>Tipo</span></p>
                    <button>Torcar</button>
                </div>
            </div>
            <div>
                <h2>opcao de envio</h2>
                <p>Essa e a opção de envio atual</p>
                <div>Trocart</div>
            </div>
            {showModal && (
                <div>
                    <h2>Esses sao os meios de envio</h2>
                    <div>
                        <p>Modal de meio de envio</p>
                        <p>Modal de meio de envio</p>
                        <p>Modal de meio de envio</p>
                    </div>
                    <button onClick={() => setShowModal(false)}>Fechar</button>
                </div>
            )}
            <div>
                <h2>Coupons de desconto</h2>
                <p>selecionados</p>
                <button onClick={() => setShowModalCoupons(true)}>Aplicar</button>
            </div>
            {showModalCoupons && (
                <div>
                    <h2>Modal de cupons</h2>
                    <div>
                        <p>Modal de coupons</p>
                        <p>Modal de coupons</p>
                        <p>Modal de coupons</p>
                    </div>
                    <button onClick={() => setShowModalCoupons(false)}>Fechar</button>
                </div>
            )}
            <div>
                <div>
                    <h2>Meios de pagamento</h2>
                    <div>
                        <button>paypal</button>
                        <button>mercado pago</button>
                        <button>cartão</button>
                        <button>Cartão de debito</button>
                        <button>Pix</button>
                        <button onClick={() => setShowModalPagamento('boleto')}>Boleto</button>
                    </div>
                    <div>
                        { showModalPagamento == 'boleto' && ( 
                            <handleModalPagamento tipo={"cartao"} />
                        )}
                    </div>
                </div>
                <div>
                    <h2>resumo do pedido</h2>
                    <div>
                        <p>total</p>
                        <p>desconto</p>
                        <p>frete</p>
                        <p>total</p>
                    </div>
                </div>
            </div>
        </div>
    )
}