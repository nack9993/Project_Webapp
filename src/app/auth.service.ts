import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  user: Observable<firebase.User>;
  private userDetails: firebase.User = null;

  constructor(
    private firebaseAuth: AngularFireAuth,
    private router: Router) {
    this.user = firebaseAuth.authState;
     this.user.subscribe((user) => {
        if (user) {
          this.userDetails = user;
        }
        else {
          this.userDetails = null;
        }
     });
  }

  register(email: string, password: string) {
    return this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Success!', value);
        // alert("Success, the information added into the system.")
        this.logout();
        this.router.navigate(['/login']);
        return email;
      })
      .catch(err => {
        console.log(err.code);
        console.log('Something went wrong:',err.message);
        // alert("Your inputted data is invalid please input it again.");
        return err.code;
      });    
  }

  login(email: string, password: string) {
    return this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        let uid = value.user.uid;
        console.log("Login with uid:" + uid);
        this.router.navigate(['/guest']);
        // alert("Login success.");
        return uid;
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
        this.router.navigate(['/login']);
        // alert("Authentication failed.");
        return "Fail";
      });
  }

  logout() {
    this.firebaseAuth
      .auth
      .signOut().then( () => {
        this.router.navigate(['/login']);
      })
  }

  resetPassword(email:string){
    console.log('reset');
    return this.firebaseAuth.auth.sendPasswordResetEmail(email)
    .then( value => {
      console.log(value);
    }).catch(function(error) {
      console.log(error);
    });
  }
}
