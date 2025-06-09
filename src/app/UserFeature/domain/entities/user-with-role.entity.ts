import { User } from '@angular/fire/auth';
import { CustomUser } from './custom-user.entity'; // Optional enum for roles
import { Role } from './role.enum';

export class UserWithRole {
  constructor(
    public firebaseUser: User, // Firebase's User object
    public customUser: CustomUser, // UserRole as a separate property
  ) { }

  isUser() {
    return this.customUser.roleName === Role.USER;
  }

  isAdmin() {
    console.log('[UserWithRole] Checking if user is admin:', this.customUser);
    console.log('[UserWithRole] ', this.customUser.roleName);
    return this.customUser.roleName === Role.ADMIN;
  }

}
