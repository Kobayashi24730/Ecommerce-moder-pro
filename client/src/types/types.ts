export type ProfileProps = {
    data: User | null;
}

export type TPcouponStatusUser = {
    id: number;
    status_id: boolean;
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