import { Ticket } from "./Ticket";

export interface BasketItem {
    ticket: Ticket;
    quantity: number;
    tour?: {
      id: number;
      name: string;
      date: Date;
    };
  }

export interface Basket{
    tickets: BasketItem[];
}