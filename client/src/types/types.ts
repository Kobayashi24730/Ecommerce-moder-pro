export type ProfileProps = {
    data: User | null;
}

export interface TPProductAttribute {
  id: number;
  product_id: number;
  name: string;
  value: string;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
  created_at: string;
  updated_at: string;
}

export interface CartData {
  id: number;
  items: CartItem[];
  subtotal: number;
}
export interface TPCompany {
  id: number;
  name: string;
  logo?: string;
  slug: string;
}

export interface TPCategory {
  id: number;
  name: string;
  slug: string;
}

export interface TPProduct {
  id: number;
  company_id: number;
  category_id: number;
  name: string;
  description: string;
  base_price: string | number; // O Laravel envia decimal como string no JSON
  stock: number;
  image?: string;
  group_image?: string[];
  
  // Relacionamentos (Eager Loading)
  attributes?: TPProductAttribute[];
  company?: TPCompany;
  category?: TPCategory;
  
  created_at: string;
  updated_at: string;
}

export type TPcouponStatusUser = {
    id: number;
    status_id: number;
    email: string;
    name: string;
}

export type TPNitifyUser = {
    id: number;
    read: boolean;
}

export type TPAddUsers = {
    name: string;
    email: string;
    password: string;
}

export type TPEditUsers = {
    name: string;
    email: string;
    password: string;
}

export type TPConfitmUsers = {
    email: string;
    password: string;
    confirmed_password: string;
}

export type TPDelUsers = {
    name: string;
    email: string;
    password: string;
}

export type TPGetUsers = {
    name: string;
    email: string;
    password: string;
}

export type Props = {
    variant: "add", "edit", "confirm", "delete", "get";
    data: TPAddUsers | TPEditUsers | TPConfitmUsers | TPDelUsers | TPGetUsers
}

export type TPForgetUser = {
    email: string;
}


//Types User

export type Address = {
  id?: number;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export type PaymentMethod = {
  id?: number;
  type: "credit_card" | "debit_card" | "pix" | "boleto";
  cardBrand?: string;
  cardLastDigits?: string;
  cardHolderName?: string;
  expirationDate?: string;
  isDefault?: boolean;
}

export type User = {
  id: number;

  // 🔐 Auth
  name: string;
  email: string;
  password?: string;
  // 👤 Perfil
  phone?: string;
  cpf?: string;
  createdAtFormatted?: string;
  birthDateFormatted?: string;
  birthDate?: string;
  avatar?: string;

  // 📍 Endereços
  addresses?: Address[];

  // 💳 Pagamentos
  paymentMethods?: PaymentMethod[];

  // 🛒 Checkout
  defaultAddressId?: number;
  defaultPaymentMethodId?: number;

  // 📦 Pedidos
  orders?: Order[];
  coupons?: Coupon[];
  notifications?: Notifications[];
  // 🔔 Preferências
  preferences?: {
    newsletter: boolean;
    smsNotifications: boolean;
    emailNotifications: boolean;
  };

  // 🔒 Segurança
  emailVerifiedAt?: string;
  twoFactorEnabled?: boolean;

  // 🕒 Controle
  createdAt?: string;
  updatedAt?: string;
}

export type OrderItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export type Notifications = {
  id: number;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  image?: string;
}

export type Coupon = {
  id: number;
  code: string;
  description: string;
  min_value?: number;
  tag: string;
  start_date: string;
  expiry_date: string;
  image?: string;
  status_id: boolean;
}
//Pedido
export type Order =  {
  id: number;
  items: OrderItem[];

  total: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "canceled";

  address: Address;
  paymentMethod: PaymentMethod;

  createdAt: string;
}