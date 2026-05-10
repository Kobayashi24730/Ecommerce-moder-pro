import type { TPProduct } from "@/types/types";
import Number from "react";
import { api } from "./api";

export async function getCartAPI() {
    const response = api.get("/cart");
    console.log('response cart: ', response);
    return response;
}
export async function addToCartAPI({product, quantity } : {product: TPProduct, quantity: number}) {
    const response = api.post("/cart", {
        product_id: product.id,
        quantity: quantity
    })
    return response;
}
