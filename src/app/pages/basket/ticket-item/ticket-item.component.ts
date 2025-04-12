import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BasketItem } from '../../../shared/models/Basket';
import { NgClass } from '@angular/common';

@Component({
  selector: 'tr[app-ticket-item]',
  standalone: true,
  imports: [NgClass],
  templateUrl: './ticket-item.component.html',
  styleUrl: './ticket-item.component.scss'
})
export class TicketItemComponent {
  @Input() item!: BasketItem;

  @Output() increase = new EventEmitter<number>();
  @Output() decrease = new EventEmitter<number>();
  
  onIncrease() {
    this.increase.emit(this.item.ticket.id);
  }
  
  onDecrease() {
    this.decrease.emit(this.item.ticket.id);
  }
}