import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

const tokyoRegion = 'asia-northeast1'

admin.initializeApp()

export const updateUserPermissions = functions.region(tokyoRegion).firestore.document('users/{uid}').onWrite((change, context) => {
  const {uid} = context.params
  const {permissions} = change.after.data() || { admin: 0, todo: 0 }
  console.info(`user document changed: ${uid}, permissions: ${JSON.stringify(permissions)}`)

  const auth = admin.auth()
  auth.setCustomUserClaims(uid, {permissions}).then(() => {
    console.info(`successfully updated Custom User Claims`)
  }).catch(err => {
    console.error(`failed to set Custom User Claims`, err)
  })

  auth.revokeRefreshTokens(uid).then(() => {
    console.info(`successfully revoke refresh token`)
  }).catch(err => {
    console.error(`failed to revoke refresh token`, err)
  })
})

export const createNewUser = functions.region(tokyoRegion).auth.user().onCreate(async user => {
  const {uid} = user
  console.info(`new user signed up, UID: ${uid}`)

  const pd = user.providerData[0]

  const store = admin.firestore()
  try {
    store.collection('users').doc(uid).create({
      name: pd.displayName,
      photoUrl: pd.photoURL,
    })
    console.info(`new user successfully created, UID: ${uid}`)

  } catch (err) {
    console.error(`failed to add user:`, err)
  }
})
