import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MuseumUser } from '../../shared/models/User';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent {
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    rePassword: new FormControl('', [Validators.required]),
    name: new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastname: new FormControl('', [Validators.required, Validators.minLength(2)])
    })
  });

  isLoading = false;
  showForm = true;
  signupError = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  register(): void {
    if (this.registerForm.invalid) {
      this.signupError = 'Érvényes adatokat adj meg.';
      return;
    }

    const password = this.registerForm.get('password');
    const rePassword = this.registerForm.get('rePassword');

    if (password?.value !== rePassword?.value) {
      return;
    }

    this.isLoading = true;
    this.showForm = false;

    const userData: Partial<MuseumUser> = {
      name: {
        firstname: this.registerForm.value.name?.firstname || '',
        lastname: this.registerForm.value.name?.lastname || ''
      },
      email: this.registerForm.value.email || '',
    };

    const email = this.registerForm.value.email || '';
    const pw = this.registerForm.value.password || '';

    this.authService.signUp(email, pw, userData)
      .then(userCredential => {
        console.log('Sikeres regisztráció:', userCredential.user);
        this.authService.updateLoginStatus(true);
        this.router.navigateByUrl('/home');
      })
      .catch(error => {
        console.error('Regisztrációs hiba:', error);
        this.isLoading = false;
        this.showForm = true;
        
        switch(error.code) {
          case 'auth/email-already-in-use':
            this.signupError = 'Az email már használatban van.';
            break;
          case 'auth/invalid-email':
            this.signupError = 'Érvénytelen email.';
            break;
          case 'auth/weak-password':
            this.signupError = 'A jelszó túl rövid: legalább 8 karakter kell legyen.';
            break;
          default:
            this.signupError = 'Hiba történt regisztráció közben. Próbálja újra később.';
        }
      });
  }
}

