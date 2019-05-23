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

  login() {
    if (this.email && this.password ) {
      this.auth.login(this.email, this.password).then( (result) => {
        if (result === "Fail") {
          alert("Authentication failed.");
        }
      })
      this.email = this.password = '';  
    } else {
      alert("Please input all required field");
    }
  }

  keyDownFunction(event) {
    if(event.keyCode == 13) {
      alert('you just clicked enter');
    }
  }

}
