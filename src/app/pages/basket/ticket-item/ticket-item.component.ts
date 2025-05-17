import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BasketItem } from '../../../shared/models/Basket';

@Component({
  selector: 'tr[app-ticket-item]',
  standalone: true,
  imports: [],
  templateUrl: './ticket-item.component.html',
  styleUrl: './ticket-item.component.scss'
})
export class TicketItemComponent {
  @Input() item!: BasketItem;

  @Output() increase = new EventEmitter<{ ticketId: string, tourId?: number }>();
  @Output() decrease = new EventEmitter<{ ticketId: string, tourId?: number }>();

onIncrease() {
  this.increase.emit({ ticketId: this.item.ticket.id, tourId: this.item.tour?.id });
}

onDecrease() {
  this.decrease.emit({ ticketId: this.item.ticket.id, tourId: this.item.tour?.id });
}
}