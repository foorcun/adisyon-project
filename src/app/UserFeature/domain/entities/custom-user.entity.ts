import { Role } from "./role.enum";

export class CustomUser {
  constructor(
    public userId: string, // uid
    public roleName: Role, // role
    public email: string, // email
  ) { }
}
