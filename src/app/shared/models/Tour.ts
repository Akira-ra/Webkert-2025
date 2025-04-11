import { Ticket } from "./Ticket";

export interface Tour{
    id: number;
    name: string;
    date: Date;
    time: number;
    tickets: Ticket[]
}