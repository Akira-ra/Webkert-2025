import { Ticket } from "./Ticket";

export interface Tour{
    id: string;
    name: string;
    date: Date;
    ticketsMax: number;
    ticketsRemain: number;
}