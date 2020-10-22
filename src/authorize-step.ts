import { autoinject } from 'aurelia-framework'
import { getLogger } from 'aurelia-logging'
import { NavigationInstruction, Next, NextCompletionResult } from 'aurelia-router'
import { performance } from 'firebase'
import { AuthService } from 'services/auth'

import { Permissions } from './services/auth'

@autoinject
export class AuthorizeStep {
  private readonly logger = getLogger(AuthorizeStep.name)

  constructor(private auth: AuthService) {}

  // http://www.foursails.co/blog/dynamic-routing/
  run(
    navigationInstruction: NavigationInstruction,
    next: Next,
  ): Promise<void | NextCompletionResult> {
    this.logger.debug('in authorize step...')

    // get all instructions for each loaded route or child route.
    const instructions = navigationInstruction.getAllInstructions()

    const userPermissions: Permissions = this.auth.user?.permissions || { admin: 0, todo: 0 }
    this.logger.warn(`user permissions: ${JSON.stringify(userPermissions)}`)

    // check if the user has permissions rquired by each instruction.
    const authorized = instructions.every(inst => {
      const requiredPermissions: Permissions = {
        todo: inst.config.settings.permissions?.todo || 0,
        admin: inst.config.settings.permissions?.admin || 0,
      }

      const allowed =
        (userPermissions.todo & requiredPermissions.todo) === requiredPermissions.todo &&
        (userPermissions.admin & requiredPermissions.admin) === requiredPermissions.admin
      this.logger.warn(
        `reoute: ${inst.fragment} requires ${JSON.stringify(
          requiredPermissions,
        )} => allowed: ${allowed}`,
        inst.config.settings?.permissions,
      )
      return allowed
    })

    if (!authorized) {
      alert(`you don't have permissions!!`)
      return next.cancel()
    }

    return next()
  }
}
