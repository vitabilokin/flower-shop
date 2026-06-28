import { Firestore, addDoc, collection, doc, setDoc } from '@angular/fire/firestore';
import { DEFAULT_SETTINGS } from '../services/settings.service';
import { SEED_BOUQUETS } from './seed-data';

// One-off helper to populate a freshly created Firestore project with the same catalog
// the public site shipped with as static demo data, so the admin panel isn't empty on
// first use. Once seeded, BouquetService reads live from Firestore, not from this file.
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

  console.log('Database seeded successfully!');
}
