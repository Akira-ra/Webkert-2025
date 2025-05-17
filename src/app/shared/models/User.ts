import { Ticket } from "./Ticket";

export interface MuseumUser{
    name:{
        firstname: string;
        lastname: string;
    };
    email: string;
}