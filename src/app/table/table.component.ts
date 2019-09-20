import { Component, OnInit } from '@angular/core';
import { GuestService } from '../guest.service';
import { Guest } from '../Guest';
import { DropEvent } from 'angular-draggable-droppable';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
export interface TabMessage { path: string, date: string };
// export interface TabMessage { userId: string, tableName: string, guestName: string, chairNum: string}
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TablePlan } from '../TablePlan';
import { Alert } from 'selenium-webdriver';

export interface TabMessage {path: string, id: string, date: string};

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})


export class TableComponent implements OnInit {

  message: string;
  private itemsCollection: AngularFirestoreCollection<TabMessage>;
  tabMessage: Observable<TabMessage[]>;
  userId: string;

  BigArray: Array<Array<Array<string | Array<string | Array<Guest>>> | string | number>> = [];
 

  constructor(private guestService: GuestService, private http: HttpClient,
    private tab: AngularFirestore, private router: Router, private datePipe: DatePipe, private fb: FormBuilder) {
    this.itemsCollection = this.tab.collection<TabMessage>('TableMessage');
    this.tabMessage = this.itemsCollection.valueChanges();

  }

  table: number = 0;
  
  objectName: string;
  objects = [];
  object = 0;
  Objectform: FormGroup;

  guests: Guest[] = [];
  guestsTemp: Guest[] = [];
  droppedData: string;
  tableName: string;
  form: FormGroup;
  dateTab: string;

  width: number;
  height: number;

  Url = 'https://api.line.me/v2/bot/message/broadcast';
  CloudUrl = 'https://us-central1-line-bot-a451a.cloudfunctions.net/WebRequest';
  headers = new HttpHeaders({
    // "Access-Control-Allow-Origin": "*"
});
  
  options = {
    headers: this.headers
  }
  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required]]
    })

    this.Objectform = this.fb.group({
      objectName: ['', [Validators.required]]
    })

    this.getGuests();
  }

  getGuests(): void {
    this.guestService.getGuests().subscribe(guests => this.guests = guests);
  }

  addObject(){
    this.objects.push(this.objectName);
    this.objectName = "";
  }

  addTable() {
    this.BigArray.push([this.table, this.tableName, []]);
    this.table++;
    this.tableName = "";
  }

  onDrop({ dropData }: DropEvent<Guest>, item , tableName): void {
    alert("Table " + tableName + " " + dropData.guestName)
    this.BigArray[item][2].push([dropData.guestName, dropData.userId]);
    this.removeGuest(dropData, this.guests);
    this.guestsTemp.push(dropData);
  }

  removeGuest(item: any, list: Array<any>) {
    let index = list.map(function (e) {
      return e.guestName
    }).indexOf(item.guestName);
    list.splice(index, 1);
  }

  removeObject(item: any, list: Array<any>) {
    console.log(item);
    let index = list.map(function (e) {
      return e
    }).indexOf(item);
    list.splice(index, 1);
  }


  removeGuestFromTable(guest: any, list: Array<any>, indexOfTable: any) {
    console.log(indexOfTable);
    list[indexOfTable][2].splice(list[indexOfTable][2].indexOf(guest), 1);
    console.log(this.guestsTemp);

    let indexOftempGuest = this.guestsTemp.map(function (e) {
      return e.guestName
    }).indexOf(guest[0]);

    console.log(indexOftempGuest);
    this.guests.push(this.guestsTemp[indexOftempGuest]);

    this.guestsTemp.splice(indexOftempGuest, 1);

  }

  removeTable(item: any, list: Array<any>) {
    for (var val of list[list.indexOf(item)][2]) {
      console.log(val[0]);
      let indexOftempGuest = this.guestsTemp.map(function (e) {
        return e.guestName
      }).indexOf(val[0]);
      console.log(indexOftempGuest);
      this.guests.push(this.guestsTemp[indexOftempGuest]);
      console.log(this.guests)
      // this.guestsTemp.splice(indexOftempGuest,1);
    }
    console.log(this.guestsTemp);
    list.splice(list.indexOf(item), 1);
    this.table--;
  }

  sendBroadCastTable(){
    console.log(this.BigArray.length)
    if(this.BigArray.length !== 0){
    for(let tables of this.BigArray){ 
     for(let table of tables[2]){
      return this.http.post(this.CloudUrl, JSON.stringify({
        "to": table[1],
        "messages":[
            {
                "type":"text",
                "text":"You Table name is : "+tables[1]
            },
        ]
    })).toPromise().then((result) => {
      console.log(result);
      this.dateTab = this.datePipe.transform(new Date(),"MMM d, y, h:mm:ss a");
      this.itemsCollection.add({path: table[0]+table[1], id: this.userId, date: this.datePipe.transform(new Date(),"MMM d, y, h:mm:ss a")})
      alert("Broadcast message is success");
    }).catch(err => {
      if(err.status == 200){
        alert('Broadcast table is success');
        console.log(table[0]);
        this.dateTab = this.datePipe.transform(new Date(),"MMM d, y, h:mm:ss a");
        this.itemsCollection.add({path: table[0]+table[1], id: table[1], date: this.datePipe.transform(new Date(),"MMM d, y, h:mm:ss a")})
      }else{
      alert('Something went wrong:'+ JSON.stringify(err));
      }
    })
     }
       }
    }
    else{
      alert("Please making a table plan first");
    }
  }
  }
  