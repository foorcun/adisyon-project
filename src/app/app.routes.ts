import { Routes } from '@angular/router';

export const routes: Routes = [
    // { path: "", loadComponent: () => import('./common/hello-firebase/hello-firebase.component').then(m => m.HelloFirebaseComponent) },
    { path: "", loadComponent: () => import('./pages/home-page/home-page.component').then(m => m.HomePageComponent) },
    { path: "settings-page", loadComponent: () => import('./pages/settings-page/settings-page.component').then(m => m.SettingsPageComponent) },
    // { path: "", loadComponent: () => import('./pages/settings-page/settings-page.component').then(m => m.SettingsPageComponent) },
    // { path: "menu-page", loadComponent: () => import('./pages/menu-item-page/menu-item-page.component').then(m => m.MenuItemPageComponent) },
    { path: "menu-page", loadComponent: () => import('./pages/menu-page/menu-page.component').then(m => m.MenuPageComponent) },
    { path: "profile-page", loadComponent: () => import('./pages/profile-page/profile-page.component').then(m => m.ProfilePageComponent) },
    { path: "home-page", redirectTo: "" },
];
