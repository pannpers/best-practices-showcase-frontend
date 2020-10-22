import { autoinject } from 'aurelia-framework'
import { AuthService } from 'services/auth'

@autoinject
export class Home {
  constructor(private auth: AuthService) {}
}
