import { Permissions } from '../services/auth'

export class User {
  constructor(
    public uid: string,
    public name: string,
    public photoUrl: string,
    public permissions: Permissions = {
      todo: 0,
      admin: 0,
    },
  ) {}
}
