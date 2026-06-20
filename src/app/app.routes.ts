import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'catalog',
    loadComponent: () => import('./features/catalog/catalog.component').then((m) => m.CatalogComponent),
  },
  {
    path: 'catalog/:id',
    loadComponent: () =>
      import('./features/catalog/bouquet-detail/bouquet-detail.component').then((m) => m.BouquetDetailComponent),
  },
  {
    path: 'order',
    loadComponent: () => import('./features/order/order.component').then((m) => m.OrderComponent),
  },
  {
    path: 'payment',
    loadComponent: () => import('./features/payment/payment.component').then((m) => m.PaymentComponent),
  },
  {
    path: 'quiz',
    loadComponent: () => import('./features/quiz/quiz.component').then((m) => m.QuizComponent),
  },
  {
    path: 'constructor',
    loadComponent: () =>
      import('./features/constructor/constructor.component').then((m) => m.ConstructorComponent),
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
