import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { adminGuard } from './core/guards/admin.guard';

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
    path: 'reminder',
    loadComponent: () => import('./features/reminder/reminder.component').then((m) => m.ReminderComponent),
  },
  {
    path: 'admin',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/admin/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: '',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        children: [
          { path: '', redirectTo: 'catalog', pathMatch: 'full' },
          {
            path: 'catalog',
            loadComponent: () =>
              import('./features/admin/catalog/catalog-admin.component').then((m) => m.CatalogAdminComponent),
          },
          {
            path: 'settings',
            loadComponent: () =>
              import('./features/admin/settings/settings.component').then((m) => m.SettingsComponent),
          },
          {
            path: 'season',
            loadComponent: () => import('./features/admin/season/season.component').then((m) => m.SeasonComponent),
          },
          {
            path: 'reminders',
            loadComponent: () =>
              import('./features/admin/reminders/reminders.component').then((m) => m.RemindersComponent),
          },
          {
            path: 'flowers',
            loadComponent: () =>
              import('./features/admin/flower-prices/flower-prices.component').then((m) => m.FlowerPricesComponent),
          },
          {
            path: 'materials',
            loadComponent: () =>
              import('./features/admin/materials/materials.component').then((m) => m.MaterialsComponent),
          },
        ],
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
