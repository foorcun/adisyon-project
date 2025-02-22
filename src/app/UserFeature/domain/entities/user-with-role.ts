import { User } from '@angular/fire/auth';
import { UserRole } from './user-role.enum'; // Optional enum for roles

export class UserWithRole {
  constructor(
    public firebaseUser: User, // Firebase's User object
    public role: UserRole, // Role as a separate property
  ) {}
}
