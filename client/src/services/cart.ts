import type { TPProduct } from "@/types/types";
import Number from "react";
import { api } from "./api";

export async function addToCartAPI(product: TPProduct, quantity: Number) {
    const response = api.post("/cart", {
        body: {
            product: product,
            quantity: quantity
        }
    })
    return response;
}