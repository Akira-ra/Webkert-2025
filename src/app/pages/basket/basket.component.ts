import { Component, Input, Output, EventEmitter } from '@angular/core';import {MatTableModule} from '@angular/material/table';
import { Basket, BasketItem } from '../../shared/models/Basket';
import { CommonModule, NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TicketItemComponent } from './ticket-item/ticket-item.component';
import { BasketService } from '../../shared/services/basket.service';


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
  basketItems: BasketItem[] = [];
  displayedColumns: string[] = ['name', 'type', 'price', 'quantity', 'total', 'actions'];
  constructor(private basketService: BasketService) {}

  @Output() quantityChanged = new EventEmitter<{ ticketId: string, newQuantity: number }>();

  async ngOnInit(): Promise<void> {
    this.basketService.basket$.subscribe(items => {
      this.basketItems = items;
    });
  }

  async loadBasket(): Promise<void> {
    this.basketItems = await this.basketService.getBasket();
  }

  getTotalPrice(): number {
    return this.basketItems.reduce((total, item) => total + item.ticket.price * item.quantity, 0);
  }
  
  async increaseQuantity(ticketId: string, tourId?: number): Promise<void> {
    const item = this.basketItems.find(i =>
      i.ticket.id === ticketId &&
      ((tourId !== undefined && i.tour?.id === tourId) || (tourId === undefined && !i.tour))
    );
  
    if (item) {
      await this.basketService.updateQuantity(ticketId, item.quantity + 1, tourId);
    }
  }
  
  async decreaseQuantity(ticketId: string, tourId?: number): Promise<void> {
    const item = this.basketItems.find(i =>
      i.ticket.id === ticketId &&
      ((tourId !== undefined && i.tour?.id === tourId) || (tourId === undefined && !i.tour))
    );
  
    if (item) {
      const newQuantity = item.quantity - 1;
      await this.basketService.updateQuantity(ticketId, newQuantity, tourId);
    }
  }

  async finalizePurchase(): Promise<void> {
    await this.basketService.finalizePurchase();
  }
}
