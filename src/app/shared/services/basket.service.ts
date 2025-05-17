import { Injectable, inject } from '@angular/core';
import { BasketItem } from '../models/Basket';
import { Ticket } from '../models/Ticket';
import { Firestore, collection, addDoc, serverTimestamp, updateDoc, increment, doc, runTransaction } from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private readonly STORAGE_KEY = 'basket';
  private basketSubject = new BehaviorSubject<BasketItem[]>(this.getStoredBasket());
  basket$ = this.basketSubject.asObservable();

  constructor(private firestore: Firestore, private auth: Auth) {}

  private getStoredBasket(): BasketItem[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveBasket(items: BasketItem[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    this.basketSubject.next(items);
  }

  async getBasket(): Promise<BasketItem[]> {
    return Promise.resolve(this.getStoredBasket());
  }

  async addToBasket(ticket: Ticket, tour?: { id: number; name: string; date: Date }): Promise<void> {
    const basket = this.getStoredBasket();

    const index = basket.findIndex(item =>
      item.ticket.id === ticket.id &&
      (item.tour?.id ?? null) === (tour?.id ?? null)
    );

    if (index > -1) {
      basket[index].quantity += 1;
    } else {
      basket.push({ ticket, quantity: 1, tour });
    }

    this.saveBasket(basket);
  }

  async updateQuantity(ticketId: string, quantity: number, tourId?: number): Promise<void> {
    const basket = this.getStoredBasket();
    const index = basket.findIndex(i =>
    i.ticket.id === ticketId &&
    ((tourId !== undefined && i.tour?.id === tourId) || (tourId === undefined && !i.tour))
  );

  if (index > -1) {
    if (quantity > 0) {
      basket[index].quantity = quantity;
    } else {
      basket.splice(index, 1);
    }
    this.saveBasket(basket);
  }
  }

  async increaseQuantity(ticketId: string, tourId?: number): Promise<void> {
    const basket = this.getStoredBasket();
    const item = basket.find(i =>
      i.ticket.id === ticketId &&
      ((tourId !== undefined && i.tour?.id === tourId) || (tourId === undefined && !i.tour))
    );

    if (item) {
      item.quantity += 1;
      this.saveBasket(basket);
    }
  }

  async decreaseQuantity(ticketId: string, tourId?: number): Promise<void> {
    const basket = this.getStoredBasket();
    const index = basket.findIndex(i =>
      i.ticket.id === ticketId &&
      ((tourId !== undefined && i.tour?.id === tourId) || (tourId === undefined && !i.tour))
    );

    if (index > -1) {
      if (basket[index].quantity > 1) {
        basket[index].quantity -= 1;
      } else {
        basket.splice(index, 1);
      }
      this.saveBasket(basket);
    }
  } 

  async finalizePurchase(): Promise<void> {
    const user = this.auth.currentUser;
    const email = user?.email ?? 'ismeretlen';

    const basket = this.getStoredBasket();
    if (basket.length === 0) return;

    try {
      await runTransaction(this.firestore, async (transaction) => {
        for (const item of basket) {
          if (item.ticket.type === 'túra' && item.tour?.id) {
            const tourRef = doc(this.firestore, 'Tour', item.tour.id.toString());
            const tourSnap = await transaction.get(tourRef);

            if (!tourSnap.exists()) {
              throw new Error(`A megadott túra (${item.tour.name}) nem található.`);
            }

            const data = tourSnap.data();
            const currentRemain = data['ticketsRemain'] ?? 0;

            if (currentRemain < item.quantity) {
              throw new Error(`Nincs elég szabad hely a "${item.tour.name}" túrára. Maradt: ${currentRemain}`);
            }

            transaction.update(tourRef, {
              ticketsRemain: currentRemain - item.quantity
            });
          }
        }
      });

      var tourTicketPaid = 0
      var basicTicketPaid= 0
      basket.forEach(item => {
        if (item.tour?.id != null) {
          tourTicketPaid += item.ticket.price * item.quantity
        } else {
          basicTicketPaid += item.ticket.price * item.quantity
        }
      });

      const purchase = {
        email,
        purchaseDate: serverTimestamp(),
        items: basket.map(item => ({
          ticketId: item.ticket.id,
          quantity: item.quantity,
          tourId: item.ticket.type === 'túra' ? item.tour?.id ?? null : null
        })),
        tourTicketPaid: tourTicketPaid,
        basicTicketPaid: basicTicketPaid
      };

      await addDoc(collection(this.firestore, 'Purchases'), purchase);
      this.saveBasket([]);

    } catch (error:any) {
      console.error('Hiba a vásárlás során:', error);
      alert(error.message ?? 'Hiba történt a vásárlás során.');
    }
  }
}
