import { Routes } from '@angular/router';
import { authGuard, publicGuard, adminGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'basket',
        loadComponent: () => import('./pages/basket/basket.component').then(m => m.BasketComponent),
        canActivate: [authGuard]
    },
    {
        path: 'login',
        loadComponent: ()  => import('./pages/login/login.component').then(m => m.LoginComponent),
        canActivate: [publicGuard]
    },
    {
        path: 'register',
        loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent),
        canActivate: [publicGuard]
    },
    {
        path: 'tickets',
        loadComponent: () => import('./pages/tickets/tickets.component').then(m => m.TicketsComponent),
        canActivate: [authGuard]
    },
    {
        path: 'admin',
        loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
        canActivate: [adminGuard]
    },
    { 
        path: 'edit/:id',
        loadComponent: () => import('./pages/edit/edit.component').then(m => m.EditComponent),
        canActivate: [adminGuard] 
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
