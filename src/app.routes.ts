import { Routes } from '@angular/router';

/**
 * Application route table. Every page is lazy-loaded via `loadComponent`
 * so the initial bundle only pays for the landing page.
 */
export const routes: Routes = [
  {
    // Landing page.
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    // Filterable/sortable product catalogue.
    path: 'items',
    loadComponent: () => import('./pages/items/items.component').then(m => m.ItemsComponent)
  },
  {
    // Single product page; :id is bound to the component's `id` input via withComponentInputBinding().
    path: 'items/:id',
    loadComponent: () => import('./pages/item-detail/item-detail.component').then(m => m.ItemDetailComponent)
  },
  {
    // Unknown URLs fall back to the catalogue rather than a dead-end 404.
    path: '**',
    redirectTo: 'items'
  }
];
