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

  testGuest: Array<Array<string>> = [];
  testGuest2: Array<Array<string[]>> = [];
  BigArray: Array<Array<Array<string | Array<string | Array<Guest>>> | string | number>> = [];
  testArray2: Array<Array<string | Array<string>> | string | number> = [];

  constructor(private guestService: GuestService, private http: HttpClient,
    private tab: AngularFirestore, private router: Router, private datePipe: DatePipe, private fb: FormBuilder) {
    this.itemsCollection = this.tab.collection<TabMessage>('TableMessage');
    this.tabMessage = this.itemsCollection.valueChanges();

  }

  someVariable: Array<Array<string | number>> = [];
  Tableplan: Array<TablePlan> = [];
  values: Array<string | number> = [];
  table: number = 0;
  tables = []
  chair;

  rectangle = 0;
  rectangles = [];
  square = 0;
  squares = [];
  round = 0;
  rounds = [];

  guests: Guest[] = [];
  guestsTemp: Guest[] = [];
  droppedData: string;
  tableName: string;
  form: FormGroup;
  dateTab: string;

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

    this.getGuests();
  }

  getGuests(): void {
    this.guestService.getGuests().subscribe(guests => this.guests = guests);
  }

  addRectangle() {
    this.rectangles.push(this.rectangle);
    this.rectangle++;
  }

  addSquare() {
    this.squares.push(this.square);
    this.square++;
  }

  addRound() {
    this.rounds.push(this.round);
    this.round++;
  }

  addTable() {
    // this.tables.push(this.table);
    // this.someVariable.push([this.table,this.tableName])

    // this.testArray2.push(this.table,this.tableName);
    // this.BigArray.push(this.testArray2);

    this.BigArray.push([this.table, this.tableName, []]);
    // console.log(this.BigArray);

    this.table++;
    this.tableName = "";
  }

  onDrop({ dropData }: DropEvent<Guest>, item): void {
    console.log(item);
    console.log(this.BigArray);
    console.log(this.BigArray[item]);
    alert("Table A" + item + " " + dropData.guestName)

    // this.someVariable[item].push(dropData.guestName);
    // this.someVariable[item].push(dropData.userId);

    // this.testGuest.push([dropData.guestName,dropData.userId]);
    // this.testGuest2.push([dropData.guestName,dropData.userId]);
    // console.log(this.testGuest2[item]);

    // this.testArray2.push([dropData.guestName,dropData.userId]);

    this.BigArray[item][2].push([dropData.guestName, dropData.userId]);
    // console.log(this.BigArray);
    // console.log(this.BigArray[0][2][0][0]);

    // this.testGuest.push(dropData.guestName,dropData.userId);
    // this.testArray[item].push(this.testGuest);

    this.removeItem(dropData, this.guests);
    this.guestsTemp.push(dropData);
    // console.log(this.guestsTemp);
    // console.log(this.testArray);
  }

  //  onDeleteDrop({dropData}: DropEvent<any>) {
  //   this.removeItem(dropData, this.tables);
  //   this.guestsTemp.push(dropData);
  // }

  removeItem(item: any, list: Array<any>) {
    let index = list.map(function (e) {
      return e.guestName
    }).indexOf(item.guestName);
    list.splice(index, 1);
  }

  test: Array<Array<string>> = [["Nack"], ["Thai"]];

  removeGuestFromTable(item: any, list: Array<any>, some: any) {
    console.log(item);
    list[some][2].splice(list[some][2].indexOf(item), 1);
    console.log(this.guestsTemp);

    let indexOftempGuest = this.guestsTemp.map(function (e) {
      return e.guestName
    }).indexOf(item[0]);

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

  sendBroadCastTable(BigArray){
    for(let tables of this.BigArray){ 
     for(let table of tables[2]){
      return this.http.post(this.CloudUrl, JSON.stringify({
        "to": table[1],
        "messages":[
            {
                "type":"text",
                "text":"Your table is "+tables[0]+" Table name : "+tables[1]
            },
        ]
    })).toPromise().then((result) => {
      console.log(result);
      this.dateTab = this.datePipe.transform(new Date(),"MMM d, y, h:mm:ss a");
      this.itemsCollection.add({path: table[0]+table[1], id: this.userId, date: this.datePipe.transform(new Date(),"MMM d, y, h:mm:ss a")})
      alert("Broadcast message is success");
    }).catch(err => {
      alert('Something went wrong:'+ err.message);
    })
     }
       }
    }
  }
  