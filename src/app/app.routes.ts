import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: "" , loadComponent: () => import('./common/hello-firebase/hello-firebase.component').then(m => m.HelloFirebaseComponent) }
];
