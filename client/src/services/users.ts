import type { TPGetUsers, TPAddUsers, TPEditUsers, TPDelUsers, TPConfitmUsers, TPForgetUser, User, TPNitifyUser, TPcouponStatusUser } from "../types/types";
import { API_URL } from "../api/connectAPI";
import { api } from "./api";

export async function getUser() {
    const response = await fetch(`${API_URL}/api/users`);
    if(!response.ok){
        throw new Error('Não foi possível carregar os usuários');
    }
    const data = await response.json();
    return data?.data ?? [];
};

export async function addUser(user: TPAddUsers) {
    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(user)
    });
    if(!response.ok){
        throw new Error('Não foi possível adicionar o usuário');
    }
    const data = await response.json();
    return data?.data ?? [];
}

export async function forgotUser(user: TPForgetUser){
    const response = await fetch(`${API_URL}/recuperation/users`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(user)
    });
    if(!response.ok){
        throw new Error('Não foi possível recuperar o usuário');
    }
    const data = await response.json();
    return data;
}

export async function submitProfile(user: User){
    try {
        const response = await api.post('/submit-profile', user);
        return response.data;
    } catch (error: any) {
        console.error("Erro no update:", error.response?.data || error.message);
        throw error;
    }
}

export async function handleRead(user: TPNitifyUser){
    const response = await api.put('/user/notification', user);
    return response.data;
}

export async function handleStatusCoupon(user: TPcouponStatusUser){
    const response = await api.put('/user/coupons', user);
    return response.data;
}