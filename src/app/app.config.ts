import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes),
  provideFirebaseApp(() =>
    initializeApp({
      apiKey: "AIzaSyCbT40f1WO9aE-ZDkaM8W18EPqS8_YIh_M",
      authDomain: "museumproject-a0bae.firebaseapp.com",
      projectId: "museumproject-a0bae",
      storageBucket: "museumproject-a0bae.firebasestorage.app",
      messagingSenderId: "852126056276",
      appId: "1:852126056276:web:ff84280ac47bcb444052c1"
    })),
  provideAuth(() => getAuth()),
  provideFirestore(() => getFirestore()),
  ]
};
