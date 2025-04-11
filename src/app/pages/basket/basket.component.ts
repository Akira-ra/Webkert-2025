import { Component, Input, Output, EventEmitter } from '@angular/core';import {MatTableModule} from '@angular/material/table';
import { Basket, BasketItem } from '../../shared/models/Basket';
import { CommonModule, NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TicketItemComponent } from './ticket-item/ticket-item.component';


@Component({
  selector: 'app-basket',
  imports: [
    MatTableModule,
    CommonModule,
    NgFor,
    MatIconModule,
    MatButtonModule,
    TicketItemComponent
  ],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss'
})
export class BasketComponent {
  @Input() basketItems: BasketItem[] = [    {
    ticket: { id: 4, name: 'felnőtt', type: 'túra', price: 3500 },
    quantity: 2
  },
  {
    ticket: { id: 5, name: 'kedvezményes', type: 'túra', price: 2900 },
    quantity: 1
  }];

  @Output() quantityChanged = new EventEmitter<{ ticketId: number, newQuantity: number }>();

  displayedColumns: string[] = ['name', 'type', 'price', 'quantity', 'total', 'actions'];

  getTotalPrice(): number {
    return this.basketItems.reduce((total, item) => total + item.ticket.price * item.quantity, 0);
  }

  increaseQuantity(ticketId: number): void {
    const item = this.basketItems.find(i => i.ticket.id === ticketId);
    if (item) {
      item.quantity += 1;
      this.quantityChanged.emit({ ticketId, newQuantity: item.quantity });
    }
  }
  
  decreaseQuantity(ticketId: number): void {
    const item = this.basketItems.find(i => i.ticket.id === ticketId);
    if (item && item.quantity > 1) {
      item.quantity -= 1; 
      this.quantityChanged.emit({ ticketId, newQuantity: item.quantity });
    }
  }
}
