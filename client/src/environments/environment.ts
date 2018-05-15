// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  hubUrl: 'http://localhost:5000/actionHub',
  delayTime: 3000,
  firebase: {
    apiKey: 'AIzaSyCSfdLXPVcQahbSTux8Z3-R-c1pFttB5Z8',
    authDomain: 'stream-tool.firebaseapp.com',
    databaseURL: 'https://stream-tool.firebaseio.com',
    projectId: 'stream-tool',
    storageBucket: 'stream-tool.appspot.com',
    messagingSenderId: '203386997257'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
