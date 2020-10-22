import { Aurelia } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import * as firebase from 'firebase/app'
import { AuthService } from 'services/auth';

import * as environment from '../config/environment.json';
import { FirebaseApp } from './services/firebase/firebase'

export function configure(aurelia: Aurelia): void {
  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName('resources/index'));

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  const firebaseApp = firebase.initializeApp(environment.firebaseConfig)
  aurelia.container.registerInstance(FirebaseApp, new FirebaseApp(firebaseApp))
  // const auth = new AuthService(firebaseApp.auth())
  // aurelia.container.registerInstance(AuthService, auth)

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
