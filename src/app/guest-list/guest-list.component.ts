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

  guests: any[];
  CloudUrl = 'https://us-central1-marry-marrige.cloudfunctions.net/BroadCastMessage';

  ngOnInit() {
    this.db.list('/guests').valueChanges()   // returns observable
              .subscribe(list=> {
              this.guests = list;
              console.log(this.guests);
              })
}

sendBroadCastAcception(){
  return this.http.post(this.CloudUrl, JSON.stringify({
    "messages":[
        {
            "type":"text",
            "text":"You didn't accept the invitation to the wedding event, please! typing 'Acception'"
        }
    ]
  })).toPromise().then((result) => {
    console.log(result);
    this.router.navigate(['/home']);
    //alert("Broadcast message is success");
  }).catch(err => {
    if(err.status == 200){
      alert('BroadCast message is sucess');
      this.router.navigate(['/home']);
      return('BroadCast message is sucess');
    }else{
    alert('Something went wrong:'+ JSON.stringify(err));
    this.router.navigate(['/home']);
    return('Something went wrong:'+ JSON.stringify(err));
    }
  });;
  }
}
