import { Component, OnInit } from '@angular/core';
import { GuestService } from '../guest.service';
import { Guest } from '../Guest';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-wish',
  templateUrl: './wish.component.html',
  styleUrls: ['./wish.component.scss']
})
export class WishComponent implements OnInit {

  constructor(private guestService: GuestService,private db: AngularFireDatabase) {}

   
  ngOnInit() {
    this.db.list('/guests').valueChanges()   // returns observable
              .subscribe(list=> {
              this.guests = list;
              console.log(this.guests);
              })
}

     guests: any;


}
