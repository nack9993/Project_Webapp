import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  email: string;
  password: string="";

  constructor(public  afAuth:  AngularFireAuth,public auth: AuthService) { }

  ngOnInit() {
  }

 registerByGenerateRandomPassword() {
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
  for (var i = 0; i < 6; i++)
    this.password += possible.charAt(Math.floor(Math.random() * possible.length));

    if (this.email && this.password) {
      this.auth.register(this.email, this.password).then( (result) => {

        console.log(result);
        
        switch (result) {
          case 'auth/email-already-in-use':
            alert("This email is already registered");            
            break;
          case 'auth/invalid-email':
            alert("Your inputted data is invalid please input it again.");            
            break;
          default:
            alert("Success, the information added into the system.");
            this.resetpassword(this.email);
            break;
        }
      }).then((result) => {
        this.email = this.password = '';
      })
    } else {
      alert("Please input all required field.")
    }
  }

   resetpassword(email:string){
    this.auth.resetPassword(email);
  }

}
