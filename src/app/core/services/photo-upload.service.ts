import { Injectable, inject } from '@angular/core';
import { Storage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class PhotoUploadService {
  private readonly storage = inject(Storage);

  async upload(file: File): Promise<string> {
    const path = `bouquets/${Date.now()}-${file.name}`;
    const fileRef = ref(this.storage, path);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  }
}
