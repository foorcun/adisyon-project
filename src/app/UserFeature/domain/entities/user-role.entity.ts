import { Role } from "./role.enum";

export class UserRole {
  constructor(
    public userId: string,
    public roleName: Role,
    public assignedAt: string // or Date
  ) { }
}
