import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from '@angular/fire/auth';
import { signInAnonymously } from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserWithRole } from '../UserFeature/domain/entities/user-with-role.entity';
import { GetUserRoleUseCase } from '../UserFeature/application/usecases/get-user-role.usecase';
import { CustomUser } from '../UserFeature/domain/entities/custom-user.entity';
import { Role } from '../UserFeature/domain/entities/role.enum';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUserWithRoleSubject = new BehaviorSubject<UserWithRole | null>(null);
  public currentUserWithRole$: Observable<UserWithRole | null> = this.currentUserWithRoleSubject.asObservable();

  constructor(private auth: Auth, private getUserRoleUseCase: GetUserRoleUseCase) {
    this.auth.onAuthStateChanged((user) => {
      console.log('User state changed:', user);
      if (user == null) {
        this.loginAnonymously();
      } else {
        this.fetchUserWithRole(user);
      }
    });
  }

  signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  signIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    console.log('Logging out...');
    this.currentUserWithRoleSubject.next(null);
    return signOut(this.auth);
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  async loginAnonymously() {
    signInAnonymously(this.auth).then(() => {
      console.log('Logged in anonymously!');
    });
  }

  /**
   * Fetches the current user and their role, then updates the observable.
   * @param firebaseUser The Firebase user object.
   */
  private fetchUserWithRole(firebaseUser: User): void {
    console.log('firebase user :', firebaseUser);
    this.getUserRoleUseCase.execute(firebaseUser.uid).subscribe({
      next: (role) => {
        console.log(`Fetched role for UID ${firebaseUser.uid}:`, role);
        if (role) {
          const userRole = new CustomUser(firebaseUser.uid, role as Role, firebaseUser.email ?? '');
          const userWithRole = new UserWithRole(firebaseUser, userRole);
          this.currentUserWithRoleSubject.next(userWithRole);
        } else {
          console.warn(`[UserService] No role found for UID ${firebaseUser.uid}`);
          this.currentUserWithRoleSubject.next(null);
        }
      },
      error: (err) => {
        console.error('Error fetching user role:', err);
        this.currentUserWithRoleSubject.next(null);
      },
    });
  }
}
