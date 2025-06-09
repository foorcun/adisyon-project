import { User } from '@angular/fire/auth';
import { UserRole } from './user-role.entity'; // Optional enum for roles
import { Role } from './role.enum';

export class UserWithRole {
  constructor(
    public firebaseUser: User, // Firebase's User object
    public role: UserRole, // UserRole as a separate property
  ) {}

  isUser(){
    return this.role.roleName === Role.USER;
  }
}
