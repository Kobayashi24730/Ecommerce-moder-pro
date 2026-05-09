import type { TPProduct } from '../types/types';
import { API_URL } from '../api/connectAPI.js';

export async function get() {
    const response = await fetch(`${API_URL}/products`);
    const products = await response.json();
    return products?.data || [];
}
