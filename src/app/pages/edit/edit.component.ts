import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Form, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Ticket } from '../../shared/models/Ticket';
import { TicketService } from '../../shared/services/ticket.service';
import { FormBuilder } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit',
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent {
  updateTicketForm!: FormGroup;
  ticketId!: string;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private route: ActivatedRoute, private ticketService: TicketService, private router: Router){}

  ngOnInit():void{
    this.ticketId = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.ticketId) {
      this.showNotification('Hibás vagy hiányzó jegy azonosító', 'error');
      return;
    }
    this.initializeTicketForm();
  }

  initializeTicketForm(): void {
    this.updateTicketForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(0)]]
    });
  }

  updateTicket(): void {
    if (this.updateTicketForm.valid) {
      const formValue = this.updateTicketForm.value;
      this.ticketService.updateTicket(this.ticketId, formValue)
        .then(() => {
          this.showNotification('Jegy sikeresen frissítve', 'success');
          this.router.navigate(['/admin']); // vagy bárhova visszairányítás
        })
        .catch(error => {
          console.error('Hiba a jegy frissítésekor:', error);
          this.showNotification('Hiba a jegy frissítésekor', 'error');
        });
    } else {
      Object.values(this.updateTicketForm.controls).forEach(control => control.markAsTouched());
      this.showNotification('Kérlek töltsd ki helyesen a mezőket', 'warning');
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

}
