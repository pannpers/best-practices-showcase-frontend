import { User } from './../models/user'
import { getLogger } from 'aurelia-logging'
import { Permissions, AdminPermissions } from './../services/auth'
import { StoreService } from './../services/store'
import { autoinject } from 'aurelia-framework'

interface PermissionSelector {
  enabled: boolean
  name: string
  bit: number
}

@autoinject
export class AdminEdit {
  private readonly logger = getLogger(AdminEdit.name)

  user: User

  permissionSelector: PermissionSelector[] = Object.entries(AdminPermissions)
    .filter(([key, val]) => {
      return isNaN(parseInt(key))
    })
    .map(([key, val]) => {
      console.info(`${key}: ${val}`)
      return {
        enabled: false,
        name: key,
        bit: val as number,
      }
    })

  constructor(private store: StoreService) {}

  async activate(params) {
    const uid = params.uid
    try {
      this.user = await this.store.getUser(uid)
    } catch (err) {
      this.logger.error(`failed to get user:`, err)
      return
    }

    this.permissionSelector.forEach(selector => {
      selector.enabled = (selector.bit & this.user.permissions.admin) === selector.bit
    })
  }
}
