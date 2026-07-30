import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { collectionDataPlain } from './firestore-helpers';

export type ReminderStatus = 'new' | 'done';

export interface Reminder {
  id?: string;
  name: string;
  date: Date;
  contact: string;
  status: ReminderStatus;
  createdAt?: unknown;
}

const COLLECTION = 'reminders';

@Injectable({ providedIn: 'root' })
export class ReminderService {
  private readonly firestore = inject(Firestore);

  async submitReminder(data: { name: string; date: Date; contact: string }) {
    return addDoc(collection(this.firestore, COLLECTION), {
      name: data.name,
      date: data.date,
      contact: data.contact,
      status: 'new' as ReminderStatus,
      createdAt: new Date(),
    });
  }

  getReminders(): Observable<Reminder[]> {
    return collectionDataPlain<Reminder>(collection(this.firestore, COLLECTION));
  }

  async markDone(id: string) {
    return updateDoc(doc(this.firestore, COLLECTION, id), { status: 'done' });
  }
}
