import 'firebase/auth'

import { EventAggregator } from 'aurelia-event-aggregator'
import { autoinject } from 'aurelia-framework'
import { getLogger } from 'aurelia-logging'
import { Router } from 'aurelia-router'
import * as firebase from 'firebase/app'
import * as firebaseui from 'firebaseui'
import { Event } from 'models/event'

import { User } from '../models/user'
import { FirebaseApp } from './firebase/firebase'

export interface Permissions {
  todo: number
  admin: number
}

export enum TodoPermissions {
  VIEW_TODO = 1 << 0,
  EDIT_TODO = 1 << 1,
}

export enum AdminPermissions {
  VIEW_USER_PERMISSIONS = 1 << 0,
  EDIT_USER_PERMISSIONS = 1 << 1,
  DELETE_USER = 1 << 2,
}

export enum AdminRoles {
  USER_PERMISSIONS_EDITOR = AdminPermissions.VIEW_USER_PERMISSIONS |
    AdminPermissions.EDIT_USER_PERMISSIONS,
}

@autoinject
export class AuthService {
  private readonly logger = getLogger(AuthService.name)

  private isSignedIn = false
  private hasInitialized = false

  private readonly config: firebaseui.auth.Config = {
    callbacks: {
      signInSuccessWithAuthResult: () => {
        return true
      },
    },
    signInFlow: 'popup',
    signInSuccessUrl: '/',
    signInOptions: [
      {
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      },
    ],
  }

  private auth: firebase.auth.Auth
  private ui: firebaseui.auth.AuthUI

  public user: User
  // public permissions: Permissions

  constructor(
    private firebaseApp: FirebaseApp,
    private router: Router,
    private ea: EventAggregator,
  ) {
    this.logger.debug('Init Firebase Auth')
    this.auth = this.firebaseApp.app.auth()
    this.ui = new firebaseui.auth.AuthUI(this.auth)

    // apply the default browser preference instead of explicitly setting language.
    this.auth.useDeviceLanguage()

    this.auth.onAuthStateChanged((user: firebase.User) => {
      // this.user = user
      this.isSignedIn = user !== null
      this.hasInitialized = true
      this.logger.debug(`auth state changed, singed-in: ${this.isSignedIn}`)

      this.ea.publish(Event.AuthStateChanged)

      if (this.isSignedIn) {
        user.getIdTokenResult().then(idTokenResult => {
          const { permissions } = idTokenResult.claims
          // this.logger.debug('user permissions', this.permissions)
          this.user = new User(user.uid, user.displayName, user.photoURL, permissions)
        })
      }
    })
  }

  async waitForInitialized(): Promise<void> {
    return new Promise(resolve => {
      if (this.hasInitialized) {
        resolve()
      }
      this.logger.debug('waiting for initialized...')
      this.ea.subscribeOnce(Event.AuthStateChanged, () => {
        this.logger.debug('initialized')
        resolve()
      })
    })
  }

  renderSignIn(): void {
    this.ui.start(`#firebase-auth-container`, this.config)
  }

  signOut(): Promise<void> {
    return this.auth.signOut().then(() => {
      this.router.navigateToRoute('sign-in')
    })
  }
}
