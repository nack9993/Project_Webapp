import { Component, OnInit } from '@angular/core';
import { GuestService } from '../guest.service';
import { Guest } from '../Guest';
import { AngularFireDatabase,AngularFireList  } from 'angularfire2/database';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guest-list',
  templateUrl: './guest-list.component.html',
  styleUrls: ['./guest-list.component.scss']
})
export class GuestListComponent implements OnInit {
  constructor(private guestService: GuestService,private db: AngularFireDatabase,
    private router: Router,private http:HttpClient) {
  }
  userId : string;
  guests: any[];
  CloudUrl = 'https://us-central1-marry-marrige.cloudfunctions.net/BroadCastMessage';

  ngOnInit() {
   this.getGuests();
}

setUserId(userId){
  this.userId = userId;
  console.log(userId)
  }

getGuests(){
  this.db.list('/guests').valueChanges()   // returns observable
  .subscribe(list=> {
  this.guests = list;
  console.log(this.guests);
  })
}

sendBroadCastAcception(userId){
  return this.http.post(this.CloudUrl, JSON.stringify({
    "to": this.userId,
    "messages":[
        {
            "type":"text",
            "text":"You didn't accept the invitation to the wedding event, please! typing 'Acceptance'"
        }
    ]
  })).toPromise().then((result) => {
    console.log(result);
    this.router.navigate(['/home']);
    //alert("Broadcast message is success");
  }).catch(err => {
    if(err.status == 200){
      alert('Resend message is sucess');
      this.router.navigate(['/home']);
      this.userId = "";
      return('Resend message is sucess');
    }else{
    alert('Error : Resend Message is not send to the user');
    this.router.navigate(['/home']);
    this.userId = "";
    return('Error : Resend Message is not send to the user');
    }
  });;
  }
}
