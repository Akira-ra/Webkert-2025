import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { Ticket } from '../../shared/models/Ticket';
import { Router } from '@angular/router';
import { TicketService } from '../../shared/services/ticket.service';
import { BasketService } from '../../shared/services/basket.service';
import { TourService } from '../../shared/services/tour.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-tickets',
  imports: [MatTableModule, MatDividerModule, MatIconModule, CommonModule, MatSelectModule, FormsModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.scss'
})

export class TicketsComponent {
  dataSource1 = new MatTableDataSource<Ticket>();
  displayedColumns1: string[] = ['name', 'price', 'actions'];
  dataSource2 = new MatTableDataSource<Ticket>();
  displayedColumns2: string[] = ['name', 'price', 'actions'];

  columnsTicketBasic = [
    { columnDef: 'name', header: 'Név', cell: (ticket: Ticket) => `${ticket.name}` },
    { columnDef: 'type', header: 'Típus', cell: (ticket: Ticket) => `${ticket.type}` },
    { columnDef: 'price', header: 'Ár', cell: (ticket: Ticket) => `${ticket.price} Ft` },
    { columnDef: 'actions', header: 'Műveletek', cell: () => '' }
  ];

  columnsTicketTour = [...this.columnsTicketBasic]
  selectedDate: Date | null = null;
  tours: any[] = [];
  isAdmin = false;

  constructor(private router: Router, private ticketService: TicketService, private basketService: BasketService, private tourService: TourService, private authService: AuthService ){
  }

  

  ngOnInit(): void {
    this.authService.isAdmin().subscribe(isAdmin => {
    this.isAdmin = isAdmin;
  });
    this.filterTickets();
    this.getAllTours();
  }

  async getAllTickets(): Promise<void> {
    try {
      const tickets = await this.ticketService.getAllTickets();
      this.dataSource1.data = tickets;
    } catch (error) {
      console.error('Hiba a jegyek betöltésekor:', error);
    }
  }

  async getAllTours(): Promise<void> {
     try {
       this.tours = await this.tourService.getAllTours(); 
     } catch (error) {
       console.error('Hiba a túrák betöltésekor:', error);
     }
  }

  async filterByDate(): Promise<void> {
    if (!this.selectedDate) {
      await this.getAllTours();
      return;
    }

    const startOfDay = new Date(this.selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(this.selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    this.tours = await this.tourService.getAvailableToursByDateRange(startOfDay, endOfDay);
  }

  async filterTickets(): Promise<void> {
    const tickets = await this.ticketService.getAllTickets();
    this.dataSource1.data = tickets.filter(ticket => ticket.type === 'belépő');
    this.dataSource2.data = tickets.filter(ticket => ticket.type === 'túra');
  }

  selectedTour: { [ticketId: string]: any } = {};

  async addToBasket(ticket: Ticket) {
  let tour = undefined;

  if (ticket.type === 'túra') {
    tour = this.selectedTour[ticket.id];
    if (!tour) {
      alert('Kérlek válassz túrát a túrajegyhez!');
      return;
    }
  }

  try {
    await this.basketService.addToBasket(ticket, tour);
    alert('Sikeresen hozzáadva a kosárhoz!');
  } catch (error) {
    console.error('Hiba a kosárhoz adás során:', error);
    alert('Hiba történt a kosárhoz adáskor.');
  }
}

  navigateToEdit(id: string): void {
    this.router.navigate(['/edit', id]);
  }

  deleteTicket(ticketId: string): void {
  if (confirm('Biztosan törölni szeretnéd ezt a jegyet?')) {
    this.ticketService.deleteTicket(ticketId)
      .then(() => {
        console.log('Jegy törölve');
        this.filterTickets(); 
      })
      .catch(error => {
        console.error('Hiba a törlés során:', error);
      });
    }
  }

}

