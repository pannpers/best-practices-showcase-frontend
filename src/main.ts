import {Aurelia} from 'aurelia-framework'
import environment from './environment'

import * as firebase from 'firebase/app'
import * as firebaseui from 'firebaseui'
import { AuthService } from 'services/auth';

export function configure(aurelia: Aurelia): void {
  aurelia.use
    .standardConfiguration()
    .feature('resources');

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  const firebaseApp = firebase.initializeApp(environment.firebaseConfig)
  const firebaseAuth = firebaseApp.auth()
  const auth = new AuthService(firebaseAuth, new firebaseui.auth.AuthUI(firebaseAuth))
  aurelia.container.registerInstance(AuthService, auth)

  aurelia.start().then(() => aurelia.setRoot());
}
