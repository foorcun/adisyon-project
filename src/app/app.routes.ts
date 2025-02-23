import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: "", loadComponent: () => import('./pages/home-page/home-page.component').then(m => m.HomePageComponent) },
    // {path:"", loadComponent: ()=> import('./pages/test-home-page/test-home-page.component').then(m=>m.TestHomePageComponent)},
    // {path: "", loadComponent: ()=> import('./pages/table-page/table-page.component').then(m=>m.TablePageComponent)},
    { path: "settings-page", loadComponent: () => import('./pages/settings-page/settings-page.component').then(m => m.SettingsPageComponent) },
    { path: "menu-page", loadComponent: () => import('./pages/menu-page/menu-page.component').then(m => m.MenuPageComponent) },
    {path: "menu-item-page", loadComponent: () => import('./pages/menu-item-page/menu-item-page.component').then(m => m.MenuItemPageComponent)},
    { path: "profile-page", loadComponent: () => import('./pages/profile-page/profile-page.component').then(m => m.ProfilePageComponent) },
    // {path: "admin-orders-page", loadComponent: () => import('./pages/order-page/order-page.component').then(m => m.OrderPageComponent)},
    {path: "admin-orders-page", loadComponent: () => import('./pages/admin-orders-page/admin-orders-page.component').then(m => m.AdminOrdersPageComponent)},
    {path: "user-orders-page", loadComponent: () => import('./pages/user-orders-page/user-orders-page.component').then(m => m.UserOrdersPageComponent)},
    {path:"cart-page", loadComponent: () => import('./pages/cart-page/cart-page.component').then(m => m.CartPageComponent)},    
    { path: "home-page", redirectTo: "" },
];
