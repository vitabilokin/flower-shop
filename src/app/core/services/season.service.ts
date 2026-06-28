import { Injectable, inject } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { docDataPlain } from './firestore-helpers';

export type SeasonHits = Record<string, string[]>;

@Injectable({ providedIn: 'root' })
export class SeasonService {
  private readonly firestore = inject(Firestore);
  private readonly docRef = doc(this.firestore, 'season_hits', 'months');

  getSeasonHits(): Observable<SeasonHits | undefined> {
    return docDataPlain<SeasonHits>(this.docRef);
  }

  async setMonthBouquets(month: number, bouquetIds: string[]) {
    return setDoc(this.docRef, { [String(month)]: bouquetIds }, { merge: true });
  }
}
