import * as firebase from 'firebase/app'
import 'firebase/auth'

import { autoinject } from 'aurelia-framework'
import { getLogger } from 'aurelia-logging'
import * as firebaseui from 'firebaseui'

@autoinject
export class AuthService {
  private readonly logger = getLogger(AuthService.name)

  private isSignedIn = false

  // private readonly config: firebaseui.auth.Config = {
  //   callbacks: {
  //     signInSuccessWithAuthResult: () => {
  //       return true
  //     },
  //   },
  //   signInFlow: 'popup',
  //   signInSuccessUrl: '/',
  //   signInOptions: [
  //     {
  //       provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  //     },
  //   ],
  // }


  constructor(
    private auth: firebase.auth.Auth,
    private ui: firebaseui.auth.AuthUI,
  ) {
    // s.ui = new firebaseui.auth.AuthUI(this.auth)

    this.auth.onAuthStateChanged((user: firebase.User) => {
      this.logger.debug(`auth state changed, singed-in: ${this.isSignedIn}`)
    })
  }

  renderSignIn() {
    //is.ui.start(`firebase-auth-container`, this.config)
  }
}
