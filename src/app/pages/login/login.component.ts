import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule, Validator, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(8)]);
  isLoading: boolean = false;
  loginError: string = '';
  showLoginForm: boolean = true;
  authSubscription?: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (this.email.invalid) {
      this.loginError = 'Kérem írjon be érvényes e-mail címet.';
      return;
    }
    
    if (this.password.invalid) {
      this.loginError = 'A jelszó legalább 8 karakter hosszú kell legyen.';
      return;
    }

    const emailValue = this.email.value || '';
    const passwordValue = this.password.value || '';
    
    this.isLoading = true;
    this.showLoginForm = false;
    this.loginError = '';



    this.authService.signIn(emailValue, passwordValue)
    .then(userCredential => {
      console.log('Login successful:', userCredential.user);
      this.authService.updateLoginStatus(true);
      this.router.navigateByUrl('/home');
    })
    .catch(error => {
      console.error('Login error:', error);
      this.isLoading = false;
      this.showLoginForm = true;
      
      switch(error.code) {
        case 'auth/user-not-found':
          this.loginError = 'Nem létezik ilyen felhasználó.';
          break;
        case 'auth/wrong-password':
          this.loginError = 'Hibás jelszó.';
          break;
        case 'auth/invalid-credential':
          this.loginError = 'Hibás e-mail vagy jelszó.';
          break;
        default:
          this.loginError = 'Hiba történt. Próbálja újra később.';
      }
    });
}

  ngOnDestroy() {
    this.authSubscription?.unsubscribe;
  }
}
