import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoleRepository } from '../../domain/repositories/role.repository';

@Injectable({
  providedIn: 'root',
})
export class GetUserRoleUseCase {

  constructor(private roleRepository: RoleRepository) {}

  /**
   * Executes the use case to fetch the role for a specific user.
   * @param uid The unique identifier for the user (UID).
   * @returns An Observable of the user's role as a string.
   */
  execute(uid: string): Observable<string | null> {
    if (!uid) {
      throw new Error('User UID is required to fetch the role.');
    }
    return this.roleRepository.getRoleByUid(uid);
  }
}
