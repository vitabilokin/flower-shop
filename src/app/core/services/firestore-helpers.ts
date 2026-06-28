import { CollectionReference, DocumentData, DocumentReference, Query, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

// @angular/fire's docData()/collectionData() helpers currently throw
// "Expected type '_Query'/'_CollectionReference'..." against this firebase/@angular-fire
// version combo (their internal _zoneWrap mishandles the ref). These call the plain
// firebase/firestore onSnapshot API directly instead, which works correctly.

export function docDataPlain<T>(ref: DocumentReference<DocumentData>): Observable<T | undefined> {
  return new Observable((subscriber) => {
    return onSnapshot(
      ref,
      (snap) => subscriber.next(snap.data() as T | undefined),
      (err) => subscriber.error(err),
    );
  });
}

export function collectionDataPlain<T>(ref: CollectionReference<DocumentData> | Query<DocumentData>): Observable<T[]> {
  return new Observable((subscriber) => {
    return onSnapshot(
      ref,
      (snap) => subscriber.next(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T)),
      (err) => subscriber.error(err),
    );
  });
}

/** Normalizes a Firestore Timestamp, JS Date, or unset field into a comparable epoch ms value. */
export function toMillis(value: unknown): number {
  if (!value) return 0;
  if (value instanceof Date) return value.getTime();
  const ts = value as { toMillis?: () => number };
  return typeof ts.toMillis === 'function' ? ts.toMillis() : 0;
}
