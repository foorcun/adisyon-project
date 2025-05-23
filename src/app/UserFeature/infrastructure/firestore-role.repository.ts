import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RoleRepository } from '../domain/repositories/role.repository';

@Injectable({
  providedIn: 'root',
})
export class FirestoreRoleRepository extends RoleRepository {
  // private baseUrl = 'https://rodb-56626-default-rtdb.europe-west1.firebasedatabase.app/users/';
  private baseUrl = 'https://adisyon-project-default-rtdb.europe-west1.firebasedatabase.app/users/';
  menuKey = 'menuKey_zeuspub';


  constructor(private http: HttpClient) {
    super();
  }

  getRoleByUid(uid: string): Observable<string | null> {
    const url = `${this.baseUrl}${this.menuKey}/${uid}.json`; // Base URL already ends with /
    return this.http.get<{ role?: string }>(url).pipe(
      map((data) => data?.role || null), // Extract the role or return null
      catchError((error) => {
        console.error('[FirestoreRoleRepository] Error retrieving role:', error);
        return of(null); // Fallback to null in case of an error
      })
    );
  }
}
