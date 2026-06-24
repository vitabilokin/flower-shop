import { Component } from '@angular/core';
import { FlowerPalette } from './components/flower-palette/flower-palette';
import { BouquetCanvas } from './components/bouquet-canvas/bouquet-canvas';
import { OrderSummary } from './components/order-summary/order-summary';

@Component({
  selector: 'app-constructor',
  imports: [FlowerPalette, BouquetCanvas, OrderSummary],
  templateUrl: './constructor.component.html',
  styleUrl: './constructor.component.scss',
})
export class ConstructorComponent {}
