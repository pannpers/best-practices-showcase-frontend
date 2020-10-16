import { Router, RouterConfiguration } from 'aurelia-router'
import { AuthService } from 'services/auth'
export class App {
  router: Router

  constructor(private auth: AuthService) {}

  configureRouter(config: RouterConfiguration, router: Router) {
    config.options.pushState = true
    config.options.root = '/'

    config.map([
      { route: '', name: 'home', moduleId: 'routes/home', title: 'Home' },
      { route: 'sign-in', name: 'sign-in', moduleId: 'routes/sign-in', title: 'Sign In' },
    ])

    config.mapUnknownRoutes('routes/home')

    this.router = router
  }
}
