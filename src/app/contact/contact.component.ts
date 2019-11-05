import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  constructor(private db: AngularFireDatabase) {}

   
  ngOnInit() {
    this.db.list('/guests').valueChanges()   // returns observable
              .subscribe(list=> {
              this.guests = list;
              console.log(this.guests);
              })
}

     guests: any;

}
