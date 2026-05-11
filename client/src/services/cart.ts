import { CartItem } from "@/types/types";
import { TPProduct } from "@/types/types";
import Number from "react";
import { api } from "./api";

export async function getCartAPI() {
    const response = api.get("/cart");
    const data = await response.then(res => res.data);
    return data.items ? data : null;
};
export async function addToCartAPI({product, quantity } : {product: TPProduct, quantity: number}) {
    const response = api.post("/cart", {
        product_id: product.id,
        quantity: quantity
    })
    return response;
};

export async function deleteToCart({ productId } : { productId: number }) {
    const response = api.delete("/cart", {
        data: {
            product_id: productId
        }
    });
    return response;
};

export async function updateCartQuantity({ productId, quantity } : { productId: number, quantity: number}) {
    const response = api.put("/cart", {
        product_id: productId,
        quantity: quantity
    });
    return response;
}