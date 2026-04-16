export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  freeShipping?: boolean;
  installments?: number;
  discount?: number;
  seller?: string;
  category?: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const categories: Category[] = [
  { id: "1", name: "Tecnologia", icon: "💻" },
  { id: "2", name: "Moda", icon: "👗" },
  { id: "3", name: "Casa", icon: "🏠" },
  { id: "4", name: "Esportes", icon: "⚽" },
  { id: "5", name: "Beleza", icon: "💄" },
  { id: "6", name: "Brinquedos", icon: "🧸" },
  { id: "7", name: "Automotivo", icon: "🚗" },
  { id: "8", name: "Mercado", icon: "🛒" },
  { id: "9", name: "Livros", icon: "📚" },
  { id: "10", name: "Eletrônicos", icon: "📱" },
];

export const products: Product[] = [
  {
    id: "1",
    title: "Smartphone Galaxy S24 Ultra 256GB 5G Tela 6.8\" Câmera Quádrupla",
    price: 4299.00,
    originalPrice: 5999.00,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop",
    ],
    rating: 4.8,
    reviews: 2341,
    freeShipping: true,
    installments: 12,
    discount: 28,
    category: "Eletrônicos",
    description: "O Galaxy S24 Ultra é o smartphone mais avançado da Samsung, com tela Dynamic AMOLED de 6.8\", processador Snapdragon 8 Gen 3, câmera quádrupla de 200MP, bateria de 5000mAh e S Pen integrada. Perfeito para quem busca o melhor em tecnologia mobile.",
  },
  {
    id: "2",
    title: "Notebook Gamer i7 16GB RAM SSD 512GB Placa de Vídeo RTX 4060",
    price: 5499.00,
    originalPrice: 7299.00,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&h=600&fit=crop",
    ],
    rating: 4.7,
    reviews: 892,
    freeShipping: true,
    installments: 12,
    discount: 25,
    category: "Tecnologia",
    description: "Notebook gamer potente com processador Intel Core i7 de 13ª geração, 16GB de RAM DDR5, SSD NVMe de 512GB e placa de vídeo NVIDIA GeForce RTX 4060. Tela IPS Full HD de 15.6\" com taxa de atualização de 144Hz.",
  },
  {
    id: "3",
    title: "Tênis Nike Air Max 90 Masculino - Preto e Branco",
    price: 449.90,
    originalPrice: 699.90,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop",
    ],
    rating: 4.6,
    reviews: 1567,
    freeShipping: true,
    installments: 10,
    discount: 36,
    category: "Moda",
    description: "O icônico Nike Air Max 90 combina estilo retrô com conforto moderno. Unidade Air Max visível no calcanhar, entressola em espuma para amortecimento e cabedal em couro e tecido. Disponível nas cores preto e branco.",
  },
  {
    id: "4",
    title: "Smart TV 55\" 4K UHD LED Crystal Processador Crystal 4K",
    price: 2199.00,
    originalPrice: 3499.00,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop",
    ],
    rating: 4.5,
    reviews: 3210,
    freeShipping: true,
    installments: 12,
    discount: 37,
    category: "Eletrônicos",
    description: "Smart TV Samsung Crystal UHD 4K de 55\" com processador Crystal 4K, HDR, sistema operacional Tizen, Wi-Fi integrado e compatível com Alexa e Google Assistente. Imagem cristalina com mais de 1 bilhão de cores.",
  },
  {
    id: "5",
    title: "Fone de Ouvido Bluetooth Over-Ear com Cancelamento de Ruído",
    price: 299.90,
    originalPrice: 499.90,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop",
    ],
    rating: 4.4,
    reviews: 4521,
    freeShipping: true,
    installments: 6,
    discount: 40,
    category: "Eletrônicos",
    description: "Fone de ouvido Bluetooth over-ear com cancelamento ativo de ruído (ANC), bateria de até 30 horas, drivers de 40mm, microfone embutido e almofadas em espuma memory foam para máximo conforto.",
  },
  {
    id: "6",
    title: "Relógio Smartwatch Fitness Tracker Monitor Cardíaco GPS",
    price: 349.90,
    originalPrice: 599.90,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
    ],
    rating: 4.3,
    reviews: 1890,
    freeShipping: true,
    installments: 6,
    discount: 42,
    category: "Eletrônicos",
    description: "Smartwatch com monitor cardíaco, GPS integrado, monitoramento de sono, mais de 100 modos de exercício, resistente à água IP68, tela AMOLED de 1.4\" e bateria de até 14 dias.",
  },
  {
    id: "7",
    title: "Câmera Digital Mirrorless 24MP 4K WiFi Bluetooth + Lente 18-55mm",
    price: 3799.00,
    originalPrice: 4999.00,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop",
    ],
    rating: 4.9,
    reviews: 567,
    freeShipping: true,
    installments: 12,
    discount: 24,
    category: "Eletrônicos",
    description: "Câmera mirrorless com sensor APS-C de 24.2MP, gravação 4K, Wi-Fi e Bluetooth integrados, autofoco de detecção de fase e lente kit 18-55mm inclusa. Ideal para fotógrafos iniciantes e intermediários.",
  },
  {
    id: "8",
    title: "Console de Videogame 1TB SSD + 2 Controles + 3 Jogos",
    price: 3299.00,
    originalPrice: 4499.00,
    image: "https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=600&h=600&fit=crop",
    ],
    rating: 4.8,
    reviews: 2100,
    freeShipping: true,
    installments: 12,
    discount: 27,
    category: "Eletrônicos",
    description: "Console de última geração com SSD de 1TB, saída 4K a 120fps, 2 controles sem fio e 3 jogos inclusos. Ray tracing, áudio 3D e retrocompatibilidade com jogos das gerações anteriores.",
  },
  {
    id: "9",
    title: "Mochila Executiva Impermeável Notebook 15.6\" USB Antifurto",
    price: 129.90,
    originalPrice: 249.90,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop",
    ],
    rating: 4.5,
    reviews: 3450,
    freeShipping: true,
    installments: 3,
    discount: 48,
    category: "Moda",
    description: "Mochila executiva impermeável com compartimento acolchoado para notebook de até 15.6\", porta USB externa, zíper antifurto, alças acolchoadas e múltiplos bolsos organizadores.",
  },
  {
    id: "10",
    title: "Kit Skincare Completo Vitamina C + Ácido Hialurônico + Protetor",
    price: 89.90,
    originalPrice: 179.90,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop",
    ],
    rating: 4.6,
    reviews: 5670,
    freeShipping: false,
    installments: 3,
    discount: 50,
    category: "Beleza",
    description: "Kit completo de skincare com sérum de Vitamina C, sérum de Ácido Hialurônico e Protetor Solar FPS 50. Ideal para uma rotina de cuidados com a pele completa, com hidratação, luminosidade e proteção.",
  },
  {
    id: "11",
    title: "Cadeira Gamer Ergonômica Reclinável com Apoio de Braço 4D",
    price: 899.90,
    originalPrice: 1499.90,
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&h=600&fit=crop",
    ],
    rating: 4.4,
    reviews: 1230,
    freeShipping: true,
    installments: 10,
    discount: 40,
    category: "Casa",
    description: "Cadeira gamer ergonômica com encosto reclinável até 180°, apoio de braço 4D ajustável, almofada lombar e cervical, base em aço reforçado e rodízios em nylon silencioso.",
  },
  {
    id: "12",
    title: "Air Fryer Digital 5.5L 1700W Timer Antiaderente 12 Funções",
    price: 349.90,
    originalPrice: 599.90,
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&h=600&fit=crop",
    ],
    rating: 4.7,
    reviews: 8900,
    freeShipping: true,
    installments: 6,
    discount: 42,
    category: "Casa",
    description: "Air Fryer digital com capacidade de 5.5 litros, 1700W de potência, 12 funções pré-programadas, timer de 60 minutos, cesto antiaderente removível e painel touch screen.",
  },
];

export const flashDeals: Product[] = products.filter(p => (p.discount || 0) >= 35);

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  
  // Find matching category names
  const matchingCategories = categories
    .filter(c => c.name.toLowerCase().includes(q))
    .map(c => c.name);

  return products.filter(p => {
    const titleMatch = p.title.toLowerCase().includes(q);
    const categoryMatch = p.category?.toLowerCase().includes(q);
    const categoryNameMatch = matchingCategories.some(
      cat => p.category?.toLowerCase() === cat.toLowerCase()
    );
    const descMatch = p.description?.toLowerCase().includes(q);
    return titleMatch || categoryMatch || categoryNameMatch || descMatch;
  });
}
