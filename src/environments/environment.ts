// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDxA8zkN0zraGsZtquuNZFIzBmIDypcG50",
    authDomain: "marry-marrige.firebaseapp.com",
    databaseURL: "https://marry-marrige.firebaseio.com",
    projectId: "marry-marrige",
    storageBucket: "marry-marrige.appspot.com",
    messagingSenderId: "380248008792",
    appId: "1:380248008792:web:511d0ffd25fc30d5"
  },
  nodeServer: "http://localhost:8081"
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
