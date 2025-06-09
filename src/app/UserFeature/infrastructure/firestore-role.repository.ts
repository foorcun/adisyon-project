import { Injectable } from '@angular/core';
import { Database, ref, onValue, DataSnapshot } from '@angular/fire/database';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RoleRepository } from '../domain/repositories/role.repository';
import { Role } from '../domain/entities/role.enum';
import { UserRole } from '../domain/entities/user-role.entity';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirestoreRoleRepository extends RoleRepository {
  private basePath = 'users';
  private menuKey = environment.key;

  private rolesSubject = new BehaviorSubject<Record<string, UserRole>>({});
  roles$ = this.rolesSubject.asObservable();

  constructor(private database: Database) {
    super();
    this.listenForAllRolesChanges();
  }

  private listenForAllRolesChanges(): void {
    const rolesRef = ref(this.database, `${this.basePath}/${this.menuKey}`);

    onValue(
      rolesRef,
      (snapshot: DataSnapshot) => {
        const data = snapshot.val();
        if (data) {
          const rolesMap: Record<string, UserRole> = {};
          for (const [uid, entry] of Object.entries(data)) {
            if (
              typeof entry === 'object' &&
              entry !== null &&
              'role' in entry &&
              'email' in entry
            ) {
              rolesMap[uid] = new UserRole(
                uid,
                entry['role'] as Role,
                entry['email'] as string
              );
            }
          }
          console.log('[FirestoreRoleRepository] Roles updated:', rolesMap);
          // Update the BehaviorSubject with the new roles map
          this.rolesSubject.next(rolesMap);
        } else {
          this.rolesSubject.next({});
        }
      },
      (error) => {
        console.error('[FirestoreRoleRepository] Failed to listen to roles:', error);
      }
    );
  }


  /**
   * Get role for a specific user UID from the BehaviorSubject.
   */
  getRoleByUid(uid: string): Observable<Role | null> {
    return this.roles$.pipe(
      map((rolesMap) => rolesMap[uid]?.roleName ?? null),
      catchError((error) => {
        console.error('[FirestoreRoleRepository] getRoleByUid error:', error);
        return of(null);
      })
    );
  }
}
