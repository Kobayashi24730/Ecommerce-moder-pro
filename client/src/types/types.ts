import { types } from "util";

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