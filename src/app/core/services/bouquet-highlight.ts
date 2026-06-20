import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BouquetHighlight {
  readonly highlightedId = signal<number | null>(null);
  private clearTimeout?: ReturnType<typeof setTimeout>;

  highlight(id: number): void {
    clearTimeout(this.clearTimeout);
    this.highlightedId.set(id);
    this.clearTimeout = setTimeout(() => this.highlightedId.set(null), 3000);
  }
}
