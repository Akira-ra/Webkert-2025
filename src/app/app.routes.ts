import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'basket',
        loadComponent: () => import('./pages/basket/basket.component').then(m => m.BasketComponent)
    },
    {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'login',
        loadComponent: ()  => import('./pages/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'tickets',
        loadComponent: () => import('./pages/tickets/tickets.component').then(m => m.TicketsComponent)
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    { 
        path: '**', loadComponent: () => import('./shared/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent) 
    },
];
