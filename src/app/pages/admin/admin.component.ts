import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Ticket } from '../../shared/models/Ticket';
import { Tour } from '../../shared/models/Tour';
import { TicketService } from '../../shared/services/ticket.service';
import { TourService } from '../../shared/services/tour.service';
import { Subscription, combineLatest } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTimepickerModule } from '@angular/material/timepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  providers: [provideNativeDateAdapter()],
  imports: [
    FormsModule, ReactiveFormsModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatSnackBarModule, MatTimepickerModule, MatDatepickerModule, MatSelectModule, CommonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit{
  hideSingleSelectionIndicator = signal(false);
  date!: Date;
  createTicketForm!: FormGroup;
  createTourForm!:FormGroup;
  private subscriptions: Subscription[] = [];
  isLoading = false;
  purchases: any[] = [];
  purchasesT: any[] = [];
  isLoadingPurchases = true;
  isLoadingPurchasesT = true;

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private tourService: TourService,
    private snackBar: MatSnackBar,
  ) {}

  async ngOnInit(): Promise<void> {
  console.log('AdminComponent ngOnInit fut');
  this.loadRecentPurchases();
  this.loadRecentPurchasesT();
  this.initializeTicketForm();
  this.initializeTourForm();
}

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadRecentPurchases() {
      console.log('Túrajegyek betöltése indul');
    this.isLoadingPurchases = true;
      this.ticketService.getTicketPurchases()
      .then(data => {
        this.purchases = data;
      })
      .catch(error => {
        console.error('Hiba a jegyvásárlások betöltése közben:', error);
        this.purchases = [];
      })
      .finally(() => {
        this.isLoadingPurchases = false;
      });
  }

  loadRecentPurchasesT() {
    this.isLoadingPurchasesT = true;
    this.tourService.getTourPurchases()
      .then(data => {
        this.purchasesT = data;
      })
      .catch(error => {
        console.error('Hiba a túrajegy vásárlások betöltése közben:', error);
        this.purchasesT = [];
      })
      .finally(() => {
        this.isLoadingPurchasesT = false;
      });
  }

  initializeTicketForm(): void {
    this.createTicketForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]]
    });
  }

  initializeTourForm(): void {
    this.createTourForm = this.fb.group({
      tourName: ['', [Validators.required, Validators.minLength(3)]],
      dateOnly: ['', [Validators.required]],
      timeOnly: ['', [Validators.required]],
      maxCapacity: ['', [Validators.required, Validators.min(0)]]
    });
  }

  createTicket(): void {
    if (this.createTicketForm.valid) {
      this.isLoading = true;
      const formValue = this.createTicketForm.value;
      const newTicket: Omit<Ticket, 'id'> = {
        name: formValue.name,
        type: formValue.type,
        price: formValue.price
      };
      
      this.ticketService.createTicket(newTicket)
        .then(() => {
          this.showNotification('Jegy sikeresen létrehozva', 'success');
          this.createTicketForm.reset({
            name: '',
            type: '',
            price: ''
          });
        })
        .catch(error => {
          console.error('Hiba a jegy létrehozása közben:', error);
          this.showNotification('Hiba a jegy létrehozása közben', 'error');
        })
        .finally(() => {
          this.isLoading = false;
        });
    } else {
      Object.keys(this.createTicketForm.controls).forEach(key => {
        const control = this.createTicketForm.get(key);
        control?.markAsTouched();
      });
      this.showNotification('Helyesen töltse ki az összes mezőt', 'warning');
    }
  }

  createTour(): void {
    if (this.createTourForm.valid) {
      this.isLoading = true;
      const formValue = this.createTourForm.value;
  
      const datePart: Date = new Date(formValue.dateOnly);
      let hours = 0, minutes = 0;
      if (formValue.timeOnly instanceof Date) {
        hours = formValue.timeOnly.getHours();
        minutes = formValue.timeOnly.getMinutes();
      } else if (typeof formValue.timeOnly === 'string') {
        [hours, minutes] = formValue.timeOnly.split(':').map(Number);
      }

      const fullDate = new Date(datePart);
      fullDate.setHours(hours);
      fullDate.setMinutes(minutes);
      fullDate.setSeconds(0);
      fullDate.setMilliseconds(0);
  
      const newTour = {
        name: formValue.tourName,
        date: fullDate,
        ticketsMax: formValue.maxCapacity,
        ticketsRemain: formValue.maxCapacity
      };
  
      this.tourService.createTour(newTour)
        .then(() => {
          this.showNotification('Túra sikeresen létrehozva', 'success');
          this.createTourForm.reset();
        })
        .catch((error: any)=> {
          console.error('Hiba a túra létrehozása közben', error);
          this.showNotification('Hiba a túra létrehozása közben', 'error');
        })
        .finally(() => {
          this.isLoading = false;
        });
    } else {
      Object.keys(this.createTourForm.controls).forEach(key => {
        this.createTourForm.get(key)?.markAsTouched();
      });
      this.showNotification('Helyesen töltse ki az összes mezőt', 'warning');
    }
  }
  
  private showNotification(message: string, type: 'success' | 'error' | 'warning'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: [`snackbar-${type}`]
    });
  }

  toggleSingleSelectionIndicator() {
    this.hideSingleSelectionIndicator.update(value => !value);
  }

}
