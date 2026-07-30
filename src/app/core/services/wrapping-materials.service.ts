import { Injectable, computed, inject } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { docDataPlain } from './firestore-helpers';

export interface MaterialOverride {
  price: number;
  available: boolean;
}

@Injectable({ providedIn: 'root' })
export class WrappingMaterialsService {
  private readonly firestore = inject(Firestore);
  private readonly ref = doc(this.firestore, 'settings', 'wrapping-materials');
  private readonly remote = toSignal(
    docDataPlain<Record<string, MaterialOverride>>(this.ref),
    { initialValue: null },
  );

  readonly overrides = computed(() => this.remote() ?? {});

  async save(overrides: Record<string, MaterialOverride>): Promise<void> {
    await setDoc(this.ref, overrides);
  }
}
