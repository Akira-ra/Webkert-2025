import { Ticket } from "./Ticket";

export interface BasketItem {
    ticket: Ticket;
    quantity: number;
  }

export interface Basket{
    tickets: BasketItem[];
}