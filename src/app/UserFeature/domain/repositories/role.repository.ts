import { Observable } from 'rxjs';

export abstract class RoleRepository {
  /**
   * Retrieves the role of a user by their UID.
   * @param uid The unique ID of the user.
   * @returns An Observable emitting the role of the user, or null if not found.
   */
  abstract getRoleByUid(uid: string): Observable<string | null>;
}
