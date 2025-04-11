import { Ticket } from "./Ticket";

export interface User{
    name:{
        firstname: string;
        lastname: string;
    };
    email: string;
    password: string;
    tickets: Ticket[];
}