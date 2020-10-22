import { autoinject } from 'aurelia-framework'
import { PLATFORM } from 'aurelia-pal'
import { Router, RouterConfiguration } from 'aurelia-router'
import { AuthService } from 'services/auth'

import { AuthorizeStep } from './authorize-step'
import { AdminPermissions, AdminRoles, TodoPermissions } from './services/auth'

@autoinject
export class App {
  router: Router

  constructor(private auth: AuthService) {}

  async configureRouter(config: RouterConfiguration, router: Router): Promise<void> {
    this.router = router

    config.options.pushState = true
    config.options.root = '/'

    await this.auth.waitForInitialized()
    config.addAuthorizeStep(AuthorizeStep)

    config.map([
      {
        route: '',
        name: 'home',
        moduleId: PLATFORM.moduleName('routes/home'),
        nav: true,
        title: 'Home',
        settings: {},
      },
      {
        route: 'sign-in',
        name: 'sign-in',
        moduleId: PLATFORM.moduleName('routes/sign-in'),
        nav: true,
        title: 'Sign In',
        settings: {},
      },
      {
        // route: 'users/:uid',
        route: 'users',
        name: 'todo-create',
        moduleId: PLATFORM.moduleName('routes/todo-create'),
        nav: true,
        title: 'Create To-Do',
        settings: {
          permissions: {
            todo: TodoPermissions.VIEW_TODO | TodoPermissions.EDIT_TODO,
          },
        },
      },
      {
        route: 'admin',
        name: 'admin',
        moduleId: PLATFORM.moduleName('routes/admin'),
        nav: true,
        title: 'Admin',
        settings: {
          permissions: {
            admin: AdminPermissions.VIEW_USER_PERMISSIONS,
          },
        },
      },
      {
        // route: 'admin-edit/:uid',
        route: 'admin-edit',
        name: 'admin-edit',
        moduleId: PLATFORM.moduleName('routes/admin-edit'),
        nav: true,
        title: 'Edit User Permissions',
        settings: {
          permissions: {
            admin: AdminPermissions.VIEW_USER_PERMISSIONS | AdminPermissions.EDIT_USER_PERMISSIONS,
            // admin: AdminRoles.USER_PERMISSIONS_EDITOR,
          },
        },
      },
    ])

    config.mapUnknownRoutes('home')
  }
}
