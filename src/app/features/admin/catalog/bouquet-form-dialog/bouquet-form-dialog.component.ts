import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Bouquet, BouquetService, BouquetType } from '../../../../core/services/bouquet.service';
import { PhotoUploadService } from '../../../../core/services/photo-upload.service';

export interface BouquetFormResult {
  data: Omit<Bouquet, 'id'>;
}

const TAG_OPTIONS = ['', 'Хіт', 'Сезонне', 'Новинка', 'Преміум'];

type PhotoSource = 'url' | 'upload';

@Component({
  selector: 'app-bouquet-form-dialog',
  imports: [FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './bouquet-form-dialog.component.html',
  styleUrl: './bouquet-form-dialog.component.scss',
})
export class BouquetFormDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<BouquetFormDialogComponent, BouquetFormResult>);
  private readonly bouquetService = inject(BouquetService);
  private readonly photoUploadService = inject(PhotoUploadService);
  readonly existing = inject<Bouquet | null>(MAT_DIALOG_DATA);

  readonly occasionOptions = this.bouquetService.getOccasionOptions();
  readonly typeOptions = this.bouquetService.getTypeOptions();
  readonly colorOptions = this.bouquetService.getColorOptions();
  readonly statusOptions = this.bouquetService.getStatusOptions();
  readonly tagOptions = TAG_OPTIONS;

  readonly photoSource = signal<PhotoSource>('url');
  readonly uploading = signal(false);
  readonly uploadError = signal('');

  readonly model: Omit<Bouquet, 'id'> = this.existing
    ? { ...this.existing, composition: this.existing.composition.map((c) => ({ ...c })) }
    : {
        name: '',
        subtitle: '',
        price: 0,
        photo: '',
        occasion: this.occasionOptions[0]?.value as Bouquet['occasion'],
        type: this.typeOptions[0]?.value as BouquetType,
        color: this.colorOptions[0]?.value as Bouquet['color'],
        tag: '',
        tags: [],
        status: 'active',
        deleted: false,
        composition: [],
      };

  setPhotoSource(source: PhotoSource): void {
    this.photoSource.set(source);
    this.uploadError.set('');
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    try {
      this.uploading.set(true);
      this.uploadError.set('');
      this.model.photo = await this.photoUploadService.upload(file);
    } catch {
      this.uploadError.set('Не вдалося завантажити фото, спробуйте ще раз');
    } finally {
      this.uploading.set(false);
    }
  }

  addCompositionRow(): void {
    this.model.composition = [...this.model.composition, { type: this.typeOptions[0].value as BouquetType, count: 1 }];
  }

  removeCompositionRow(index: number): void {
    this.model.composition = this.model.composition.filter((_, i) => i !== index);
  }

  save(): void {
    this.dialogRef.close({ data: this.model });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
