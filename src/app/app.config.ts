import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { FirestoreRoleRepository } from './UserFeature/infrastructure/firestore-role.repository';
import { RoleRepository } from './UserFeature/domain/repositories/role.repository';
import { provideHttpClient } from '@angular/common/http';

const firebaseConfig = {
  apiKey: "AIzaSyCEbHghNUSZ6juY9bPRWdrmH0xK_FDk5hY",
  authDomain: "adisyon-project.firebaseapp.com",
  databaseURL: "https://adisyon-project-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "adisyon-project",
  storageBucket: "adisyon-project.firebasestorage.app",
  messagingSenderId: "296178610293",
  appId: "1:296178610293:web:88de2289b5fa4934cf083c",
  measurementId: "G-Q3WTBR0XSW"
};

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
  provideHttpClient(),
  provideFirebaseApp(() => initializeApp(firebaseConfig)),
  provideAuth(() => getAuth()),
  provideDatabase(() => getDatabase()),
  { provide: RoleRepository, useClass: FirestoreRoleRepository }
  ]
};
