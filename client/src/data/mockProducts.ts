import { TPProduct, TPCategory } from "@/types/types";

export const categories: TPCategory[] = [
  { id: 1, name: "Tecnologia", slug: "tecnologia" },
  { id: 2, name: "Moda",  slug: "moda" },
  { id: 3, name: "Casa",  slug: "casa" },
  { id: 4, name: "Esportes", slug: "esportes" },
  { id: 10, name: "Eletrônicos", slug: "eletronicos" },
];

export const products: TPProduct[] = [
  {
    id: 101,
    company_id: 1,
    category_id: 10,
    name: "Smartphone Galaxy S24 Ultra 256GB 5G Tela 6.8\"",
    description: "O Galaxy S24 Ultra é o smartphone mais avançado da Samsung, com câmera de 200MP e IA integrada.",
    base_price: 4299.00,
    stock: 15,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    attributes: [
      { id: 1, product_id: 101, name: "Cor", value: "Titânio" },
      { id: 2, product_id: 101, name: "Memória", value: "256GB" }
    ],
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z"
  },
  {
    id: 102,
    company_id: 1,
    category_id: 1,
    name: "Notebook Gamer i7 16GB RAM RTX 4060",
    description: "Potência extrema para jogos e trabalho pesado com RTX 4060.",
    base_price: 5499.00,
    stock: 8,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
    attributes: [
      { id: 3, product_id: 102, name: "RAM", value: "16GB DDR5" },
      { id: 4, product_id: 102, name: "GPU", value: "RTX 4060" }
    ],
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z"
  },
  {
    id: 103,
    company_id: 2,
    category_id: 2,
    name: "Tênis Nike Air Max 90 Masculino",
    description: "Estilo retrô com conforto moderno e amortecimento Air Max.",
    base_price: 449.90,
    stock: 50,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    attributes: [
      { id: 5, product_id: 103, name: "Tamanho", value: "42" },
      { id: 6, product_id: 103, name: "Cor", value: "Preto/Branco" }
    ],
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z"
  },
  {
    id: 104,
    company_id: 1,
    category_id: 10,
    name: "Fone de Ouvido Bluetooth Over-Ear ANC",
    description: "Cancelamento ativo de ruído e bateria de 30 horas.",
    base_price: 299.90,
    stock: 30,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    attributes: [],
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z"
  }
];

// Função de busca adaptada para os novos campos
export function searchProducts(query: string): TPProduct[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  
  return products.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.description.toLowerCase().includes(q)
  );
}

export const flashDeals: TPProduct[] = products.filter(p => Number(p.base_price) > 1000);