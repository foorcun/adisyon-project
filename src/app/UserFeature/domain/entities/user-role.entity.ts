import { Role } from "./role.enum";

export class UserRole {
  constructor(
    public userId: string, // uid
    public roleName: Role, // role
    public email: string, // email
  ) { }
}
