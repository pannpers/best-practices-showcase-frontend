import { AuthService } from '../services/auth'
import { autoinject } from 'aurelia-framework'

@autoinject
export class SignIn {
  constructor(private auth: AuthService) {}

  attached() {
    // this.auth.renderSignIn()
  }
}
