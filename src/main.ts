import {Aurelia} from 'aurelia-framework';
import * as environment from '../config/environment.json';
import {PLATFORM} from 'aurelia-pal';

import * as firebase from 'firebase/app'
// import * as firebaseui from 'firebaseui'
import { AuthService } from 'services/auth';

export function configure(aurelia: Aurelia): void {
  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName('resources/index'));

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  const firebaseApp = firebase.initializeApp(environment.firebaseConfig)
  const firebaseAuth = firebaseApp.auth()
  // const auth = new AuthService(firebaseAuth, new firebaseui.auth.AuthUI(firebaseAuth))
  const auth = new AuthService(firebaseApp.auth())
  aurelia.container.registerInstance(AuthService, auth)

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
