import { autoinject } from 'aurelia-framework'
import { getLogger } from 'aurelia-logging'

import { User } from './../models/user'
import { StoreService } from './../services/store'

@autoinject
export class Admin {
  private readonly logger = getLogger(Admin.name)
  users: User[] = []
  constructor(private store: StoreService) {}

  async attached() {
    try {
      this.users = await this.store.listUsers()
    } catch (err) {
      this.logger.error(`failed to list users:`, err)
    }
  }
}
