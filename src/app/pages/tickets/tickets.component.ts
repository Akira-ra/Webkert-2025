import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { Ticket } from '../../shared/models/Ticket';
import {MatDividerModule} from '@angular/material/divider';

const TICKETS_BASIC: Ticket[] = [
  { id: 0, name: 'felnőtt', type: 'belépő', price: 3200 },
  { id: 1, name: 'kedvezményes', type: 'belépő', price: 2700 },
  { id: 2, name: 'gyerek', type: 'belépő', price: 2200 },
];
const TICKETS_TOUR: Ticket[] = [
  { id: 4, name: 'felnőtt', type: 'túra', price: 3500 },
  { id: 5, name: 'kedvezményes', type: 'túra', price: 2900 },
  { id: 6, name: 'gyerek', type: 'túra', price: 2500 },
];

@Component({
  selector: 'app-tickets',
  imports: [MatTableModule, MatDividerModule],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.scss'
})

export class TicketsComponent {
  columnsTicketBasic = [
    { columnDef: 'name', header: 'Típus', cell: (ticket: Ticket) => ticket.name },
    { columnDef: 'price', header: 'Ár (Ft)', cell: (ticket: Ticket) => `${ticket.price} Ft` },
    { columnDef: 'actions', header: 'Műveletek', cell: (ticket: Ticket) => ticket }
  ];

  columnsTicketTour = [
    { columnDef: 'name', header: 'Típus', cell: (ticket: Ticket) => ticket.name },
    { columnDef: 'price', header: 'Ár (Ft)', cell: (ticket: Ticket) => `${ticket.price} Ft` },
    { columnDef: 'actions', header: 'Műveletek', cell: (ticket: Ticket) => ticket }
  ];

  dataSource1 = TICKETS_BASIC;
  displayedColumns1 = this.columnsTicketBasic.map(c => c.columnDef);

  dataSource2 = TICKETS_TOUR;
  displayedColumns2 = this.columnsTicketTour.map(c => c.columnDef);


  addToBasket(ticket: Ticket) {
    console.log('Added to basket:', ticket);
    // TODO
  }
}

