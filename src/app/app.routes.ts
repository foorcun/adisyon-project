import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: "", loadComponent: () => import('./common/hello-firebase/hello-firebase.component').then(m => m.HelloFirebaseComponent) },
    { path: "settings-page", loadComponent: () => import('./pages/settings-page/settings-page.component').then(m => m.SettingsPageComponent) },
];
