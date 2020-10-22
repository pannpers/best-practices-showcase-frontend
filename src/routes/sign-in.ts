import { autoinject } from 'aurelia-framework'
import { getLogger } from 'aurelia-logging'

import { AuthService } from '../services/auth'

@autoinject
export class SignIn {
  private readonly logger = getLogger(SignIn.name)

  constructor (private auth: AuthService) { }

  attached(): void {
    this.auth.renderSignIn()
  }
}
