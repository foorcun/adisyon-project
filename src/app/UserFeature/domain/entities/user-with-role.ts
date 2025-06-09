import { User } from '@angular/fire/auth';
import { UserRole } from './user-role.entity'; // Optional enum for roles
import { Role } from './role.enum';

export class UserWithRole {
  constructor(
    public firebaseUser: User, // Firebase's User object
    public role: UserRole, // UserRole as a separate property
  ) { }

  isUser() {
    return this.role.roleName === Role.USER;
  }

  isAdmin() {
    console.log('[UserWithRole] Checking if user is admin:', this.role);
    console.log('[UserWithRole] ', this.role.roleName);
    return this.role.roleName === Role.ADMIN;
  }

}
