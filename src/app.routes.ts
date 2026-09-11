import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'items',
        loadComponent: () => import('./pages/items/items.component').then(m => m.ItemsComponent)
    },
    {
        path: 'items/:id',
        loadComponent: () => import('./pages/item-detail/item-detail.component').then(m => m.ItemDetailComponent)
    },
    {
        path: '**',
        redirectTo: 'items'
    }
];
