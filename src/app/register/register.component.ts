import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  email: string;
  password: string;

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

  register() {
    if (this.email && this.password) {
      this.auth.register(this.email, this.password).then( (result) => {

        console.log(result);
        
        switch (result) {
          case 'auth/email-already-in-use':
            alert("Your inputted data is invalid please input it again.");            
            break;
          case 'auth/invalid-email':
            alert("Your inputted data is invalid please input it again.");            
            break;
          case 'auth/weak-password':
            alert("Your inputted data is invalid please input it again.");            
            break;
        
          default:
            alert("Success, the information added into the system.");
            break;
        }
      })
      this.email = this.password = '';
    } else {
      alert("Please input all required field.")
    }
  }

}
