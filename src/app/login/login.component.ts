import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

  loginByService(email,password) {
    if (this.email && this.password ) {
      this.auth.login(this.email, this.password).then( (result) => {
        if (result === "Authentication failed") {
          alert("Authentication Fail");
          return('Authentication failed');
        }
      })
      this.email = this.password = '';  
    } else {
      alert("Please input all required field");
    }
  }

}
