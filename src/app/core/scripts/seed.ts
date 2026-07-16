import { Firestore, addDoc, collection, doc, setDoc } from '@angular/fire/firestore';
import { DEFAULT_SETTINGS } from '../services/settings.service';
import { SEED_BOUQUETS } from './seed-data';

export async function seedDatabase(firestore: Firestore): Promise<void> {
  for (const bouquet of SEED_BOUQUETS) {
    await addDoc(collection(firestore, 'bouquets'), {
      ...bouquet,
      tag: bouquet.tag ?? '',
      status: 'active',
      deleted: false,
      composition: [{ type: bouquet.type, count: 9 }],
      createdAt: new Date(),
    });
  }

  await setDoc(doc(firestore, 'settings', 'main'), DEFAULT_SETTINGS);
}
