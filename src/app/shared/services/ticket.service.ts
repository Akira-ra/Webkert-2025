import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, orderBy, getDoc, where, limit } from '@angular/fire/firestore';
import { Observable, from, switchMap, map, of, take, firstValueFrom } from 'rxjs';
import { Ticket } from '../models/Ticket';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private readonly TICKETS_COLLECTION = 'Ticket';
  private readonly PURCHASES_COLLECTION = "Purchases";

  constructor(private authService: AuthService, private firestore: Firestore) {}

  async getAllTickets(): Promise<Ticket[]> {
    const ticketsRef = collection(this.firestore, this.TICKETS_COLLECTION);
    const q = query(ticketsRef, orderBy('name'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Ticket);
  }

  async getTicketPurchases() {
    const purchasesCollection = collection(this.firestore, this.PURCHASES_COLLECTION);
  
    const q = query(
          purchasesCollection,
          where('basicTicketPaid', '>', 0),
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

  async createTicket(ticket: Omit<Ticket, 'id'>): Promise<Ticket>{
    try {
      const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)));
      if (user?.email != "admin@gmail.com") {
        throw new Error('Nem megfelelő jogosultság');
      }
      const ticketsCollection = collection(this.firestore, this.TICKETS_COLLECTION);
      
      const ticketToSave = {
        ...ticket
      };

      const docRef = await addDoc(ticketsCollection, ticketToSave);
      const ticketId = docRef.id;

      await updateDoc(docRef, { id: ticketId });
      
      const newTicket = {
        ...ticketToSave,
        id: ticketId
      } as Ticket;

      return newTicket;
    } catch (error) {
      console.error('Hiba a jegy létrehozása közben:', error);
      throw error;
    }
  }

  async updateTicket(ticketId: string, updatedData: Partial<Ticket>): Promise<void> {
    try {
      const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)));
      if (user?.email != "admin@gmail.com") {
        throw new Error('Nem megfelelő jogosultság');
      }
      
      const dataToUpdate: any = { ...updatedData };
      
      const ticketDocRef = doc(this.firestore, this.TICKETS_COLLECTION, ticketId);
      return updateDoc(ticketDocRef, dataToUpdate);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async deleteTicket(ticketId: string): Promise<void> {
  try {
    const user = await firstValueFrom(this.authService.currentUser.pipe(take(1)));
    if (user?.email !== 'admin@gmail.com') {
      throw new Error('Nem megfelelő jogosultság');
    }

    const ticketDocRef = doc(this.firestore, this.TICKETS_COLLECTION, ticketId);
    await deleteDoc(ticketDocRef);
    console.log(`Ticket (${ticketId}) sikeresen törölve.`);
  } catch (error) {
    console.error('Hiba a jegy törlése közben:', error);
    throw error;
  }
}

}
