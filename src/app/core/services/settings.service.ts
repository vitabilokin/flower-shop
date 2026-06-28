import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { docDataPlain } from './firestore-helpers';

export interface SiteSettings {
  shopName: string;
  phone: string;
  telegram: string;
  viber: string;
  instagram: string;
  address: string;
  workingHours: string;
  slogan: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  shopName: 'Posy',
  phone: '+38 (067) 000-00-00',
  telegram: '@posy_flowers',
  viber: '380670000000',
  instagram: '@posy.flowers',
  address: 'Київ, вул. Квіткова, 1',
  workingHours: 'Пн-Нд: 08:00 – 21:00',
  slogan: 'Квіти, що говорять за вас',
};

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly firestore = inject(Firestore);
  private readonly docRef = doc(this.firestore, 'settings', 'main');

  private readonly remoteSettings = toSignal(docDataPlain<SiteSettings>(this.docRef), { initialValue: undefined });

  // Falls back to sane defaults until Firestore has been seeded with real settings,
  // so the public site never shows blank contact info.
  readonly settings = () => ({ ...DEFAULT_SETTINGS, ...this.remoteSettings() });

  async save(data: SiteSettings): Promise<void> {
    await setDoc(this.docRef, data);
  }
}
