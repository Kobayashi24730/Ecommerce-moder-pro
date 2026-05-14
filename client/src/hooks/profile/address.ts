import { Mutation, useMutation, useQueryClient } from '@tanstack/react-query';import { useClientQuery, useMutate } from "@tanstack/react-query";
import { newAdress } from "../../services/users";
import { toast } from "sonner";

export const useAddress = () => {
    const clientquery = useQueryClient();
    return useMutation({
        mutationFn: (data) => newAdress(data),
        onSuccess: () => toast.success("Endereço adicionado com sucesso!"),
        onError: () => toast.error("Erro ao adicionar endereço")
    });
}