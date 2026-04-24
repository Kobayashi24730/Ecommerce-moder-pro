import type { TPGetUsers, TPAddUsers, TPEditUsers, TPDelUsers, TPConfitmUsers, TPForgetUser } from "../types/types";
import { API_URL } from "../api/connectAPI";

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