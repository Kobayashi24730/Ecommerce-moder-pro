import type { TPProduct } from '../types/types';
import { API_URL } from '../api/connectAPI.js';

export async function get() {
    const response = await fetch(`${API_URL}/products`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    return data.data || [];
}
