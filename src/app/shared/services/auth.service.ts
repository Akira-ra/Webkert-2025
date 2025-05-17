import { Injectable } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword,
  signOut,
  authState,
  User,
  UserCredential,
  User as FirebaseUser,
  createUserWithEmailAndPassword
} from '@angular/fire/auth';
import { from, map, Observable, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { 
  Firestore, 
  collection, 
  doc, 
  setDoc,
  getDoc 
} from '@angular/fire/firestore';
import { MuseumUser } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: Observable<User | null>;
  
  
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    this.currentUser = authState(this.auth);
  }
  
  signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
  
  signOut(): Promise<void> {
    localStorage.setItem('isLoggedIn', 'false');
    return signOut(this.auth).then(() => {
      this.router.navigateByUrl('/home');
    });
  }

  isAdmin(): Observable<boolean> {
    return this.currentUser.pipe(
      map(user => user?.email === 'admin@gmail.com')
    );
  }

  async signUp(email: string, password: string, userData: Partial<MuseumUser>): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth, 
        email, 
        password
      );
      
      await this.createUserData(userCredential.user.uid, {
        ...userData,
        email: email,
      });

      return userCredential;
    } catch (error) {
      console.error('Hiba a regisztráció során:', error);
      throw error;
    }
  }

  private async createUserData(userId: string, userData: Partial<MuseumUser>): Promise<void> {
    const userRef = doc(collection(this.firestore, 'User'), userId);
    
    return setDoc(userRef, userData);
  }
  
  isLoggedIn(): Observable<User | null> {
    return this.currentUser;
  }
  
  updateLoginStatus(isLoggedIn: boolean): void {
    localStorage.setItem('isLoggedIn', isLoggedIn ? 'true' : 'false');
  }
}
