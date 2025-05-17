import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, orderBy, getDoc, where, Timestamp, limit } from '@angular/fire/firestore';
import { Observable, from, switchMap, map, of, take, firstValueFrom } from 'rxjs';
import { Tour } from '../models/Tour';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TourService {
  private readonly TOUR_COLLECTION = 'Tour';
  private readonly PURCHASES_COLLECTION = "Purchases";

  constructor(private authService: AuthService, private firestore: Firestore) { }

  async getAllTours(): Promise<Tour[]> {
    const tourCollection = collection(this.firestore, this.TOUR_COLLECTION);
    const querySnapshot = await getDocs(tourCollection);
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as Omit<Tour, 'id'> & { date: any };
      return {
        id: doc.id,
        ...data,
        date: data.date.toDate()
      };
    });
  }

    async getTourPurchases() {
      console.log('TourService: getTourPurchases hívás indul');
      const purchasesTCollection = collection(this.firestore, this.PURCHASES_COLLECTION);
    
      const q = query(
            purchasesTCollection,
            where('tourTicketPaid', '>', 0),
            orderBy('purchaseDate'),
            limit(3)
          );
  
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        purchaseDate: doc.data()['purchaseDate']?.toDate() ?? null
      }));
    }

  getAvailableToursByDateRange(start: Date, end: Date): Promise<Tour[]> {
    const tourCollection = collection(this.firestore, this.TOUR_COLLECTION);
    const q = query(
      tourCollection,
      where('date', '>=', Timestamp.fromDate(start)),
      where('date', '<=', Timestamp.fromDate(end)),
      where('ticketsRemain', '>', 0)
    );
  
    return getDocs(q).then(snapshot =>
      snapshot.docs.map(doc => {
        const data = doc.data() as Omit<Tour, 'id'> & { date: any };
        return {
          id: doc.id,
          ...data,
          date: data.date.toDate()
        };
      })
    );
  }

  async createTour(tour: Omit<Tour, 'id'>): Promise<Tour>{
      try {
        const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)));
        if (user?.email != "admin@gmail.com") {
          throw new Error('Nem megfelelő jogosultság');
        }
        const tourCollection = collection(this.firestore, this.TOUR_COLLECTION);
        
        const tourToSave = {
          ...tour
        };
  
        const docRef = await addDoc(tourCollection, tourToSave);
        const tourId = docRef.id;
  
        await updateDoc(docRef, { id: tourId });
        
        const newTour = {
          ...tourToSave,
          id: tourId
        } as Tour;
  
        return newTour;
      } catch (error) {
        console.error('Hiba a jegy létrehozása közben:', error);
        throw error;
    }
  }
}
