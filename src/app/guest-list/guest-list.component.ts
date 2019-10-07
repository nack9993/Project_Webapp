import { Component, OnInit } from '@angular/core';
import { GuestService } from '../guest.service';
import { Guest } from '../Guest';
import { AngularFireDatabase,AngularFireList  } from 'angularfire2/database';

@Component({
  selector: 'app-guest-list',
  templateUrl: './guest-list.component.html',
  styleUrls: ['./guest-list.component.scss']
})
export class GuestListComponent implements OnInit {
  constructor(private guestService: GuestService,private db: AngularFireDatabase) { 
  }

  guests: any[];

  ngOnInit() {
    this.db.list('/guests').valueChanges()   // returns observable
              .subscribe(list=> {
              this.guests = list;
              console.log(this.guests);
              })
}

}
