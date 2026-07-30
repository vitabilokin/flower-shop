import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { docDataPlain } from './firestore-helpers';

@Injectable({ providedIn: 'root' })
export class FlowerPricesService {
  private readonly firestore = inject(Firestore);
  private readonly docRef = doc(this.firestore, 'settings', 'flower-prices');

  private readonly remote = toSignal(docDataPlain<Record<string, number>>(this.docRef), {
    initialValue: undefined,
  });

  readonly overrides = computed(() => this.remote() ?? {});

  async save(overrides: Record<string, number>): Promise<void> {
    await setDoc(this.docRef, overrides);
  }
}
