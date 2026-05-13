<?php

use App\Models\User;
use App\Models\Coupon;
use App\Models\Notification;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\Hash;

// 1. Criar um Usuário
$user = User::create([
    'name' => 'Usuario Teste',
    'email' => 'teste@example.com',
    'password' => Hash::make('password123'),
    'phone' => '85998765432',
    'cpf' => '12345678900',
    'birthDate' => '1990-05-15',
    'avatar' => 'https://i.pravatar.cc/150?img=68',
    'preferences' => ['newsletter' => true, 'smsNotifications' => false, 'emailNotifications' => true],
    'defaultAddressId' => null, // Será preenchido se um endereço for criado
    'defaultPaymentMethodId' => null, // Será preenchido se um método de pagamento for criado
]);

echo "Usuário criado: {$user->name} (ID: {$user->id})\n";

// 2. Criar Cupons
$coupon1 = Coupon::create([
    'code' => 'DESCONTO10',
    'description' => '10% de desconto na primeira compra',
    'min_value' => 50.00,
    'tag' => 'primeira_compra',
    'start_date' => now(),
    'expiry_date' => now()->addMonths(3),
    'status_id' => 1, // Ativo
    'image' => 'https://via.placeholder.com/150/0000FF/FFFFFF?text=10%25OFF',
]);

$coupon2 = Coupon::create([
    'code' => 'FRETEGRATIS',
    'description' => 'Frete grátis em compras acima de R$100',
    'min_value' => 100.00,
    'tag' => 'frete',
    'start_date' => now()->subDays(10),
    'expiry_date' => now()->addMonth(),
    'status_id' => 1, // Ativo
    'image' => 'https://via.placeholder.com/150/FF0000/FFFFFF?text=FRETEGRATIS',
]);

echo "Cupons criados: {$coupon1->code} (ID: {$coupon1->id}), {$coupon2->code} (ID: {$coupon2->id})\n";

// 3. Anexar Cupons ao Usuário
$user->coupons()->attach([$coupon1->id, $coupon2->id]);

echo "Cupons anexados ao usuário.\n";

// 4. Criar Notificações para o Usuário
$notification1 = Notification::create([
    'user_id' => $user->id,
    'title' => 'Bem-vindo ao E-commerce!',
    'message' => 'Obrigado por se cadastrar. Explore nossos produtos incríveis.',
    'read' => false,
    'image' => 'https://via.placeholder.com/100/00FF00/FFFFFF?text=Welcome',
]);

$notification2 = Notification::create([
    'user_id' => $user->id,
    'title' => 'Oferta Especial para Você!',
    'message' => 'Não perca 20% de desconto em eletrônicos. Use o código OFERTA20.',
    'read' => false,
    'image' => 'https://via.placeholder.com/100/FFFF00/000000?text=Offer',
]);

echo "Notificações criadas para o usuário.\n";

// 5. Criar Produtos de Exemplo (se não existirem, para OrderItems)
$product1 = Product::firstOrCreate(
    ['name' => 'Smart TV 50 polegadas 4K'],
    [
        'company_id' => 1, // Assumindo que existe uma empresa com ID 1
        'description' => 'Smart TV com resolução 4K e sistema operacional inteligente.',
        'base_price' => '2500.00',
        'sku' => 'TV50-4K-SMART',
        'stock' => 10,
        'image' => 'https://images.unsplash.com/photo-1593305841395-f122549d7904?w=400&h=400&fit=crop',
    ]
);

$product2 = Product::firstOrCreate(
    ['name' => 'Console de Videogame Última Geração'],
    [
        'company_id' => 1,
        'description' => 'Console potente para os jogos mais recentes.',
        'base_price' => '3000.00',
        'sku' => 'CONSOLE-ULTRA',
        'stock' => 5,
        'image' => 'https://images.unsplash.com/photo-1606144042611-1afb4242ee8b?w=400&h=400&fit=crop',
    ]
);

echo "Produtos de exemplo criados/encontrados: {$product1->name} (ID: {$product1->id}), {$product2->name} (ID: {$product2->id})\n";

// 6. Criar uma Compra (Order) para o Usuário
$order = Order::create([
    'user_id' => $user->id,
    'total' => 5500.00, // Soma dos produtos
    'status' => 'paid',
    'address_snapshot' => json_encode([
        'street' => 'Rua Exemplo',
        'number' => '123',
        'complement' => 'Apto 101',
        'neighborhood' => 'Centro',
        'city' => 'Cidade Teste',
        'state' => 'CE',
        'zipCode' => '60000-000',
        'country' => 'Brasil',
    ]),
    'payment_method_snapshot' => json_encode([
        'type' => 'credit_card',
        'cardBrand' => 'Visa',
        'cardLastDigits' => '1234',
        'cardHolderName' => 'Usuario Teste',
        'expirationDate' => '12/25',
    ]),
]);

echo "Compra criada: ID {$order->id} (Total: {$order->total})\n";

// 7. Adicionar Itens à Compra
OrderItem::create([
    'order_id' => $order->id,
    'product_id' => $product1->id,
    'name' => $product1->name,
    'price' => $product1->base_price,
    'quantity' => 1,
    'image' => $product1->image,
]);

OrderItem::create([
    'order_id' => $order->id,
    'product_id' => $product2->id,
    'name' => $product2->name,
    'price' => $product2->base_price,
    'quantity' => 1,
    'image' => $product2->image,
]);

echo "Itens adicionados à compra.\n";

echo "\nScript Tinker concluído com sucesso!\n";

return 'Dados de exemplo populados.';
