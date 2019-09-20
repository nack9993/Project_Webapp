import { Component, OnInit } from '@angular/core';
import { GuestService } from '../guest.service';
import { Guest } from '../Guest';
import { DropEvent } from 'angular-draggable-droppable';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TablePlan } from '../TablePlan';
import { Alert } from 'selenium-webdriver';
import html2canvas from 'html2canvas';
import { AngularFireStorage } from 'angularfire2/storage';

export interface TabMessage {path: string, id: string, date: string};
export interface BigArray {path: string[], date: string}
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})


export class TableComponent implements OnInit {

  message: string;
  private itemsCollection: AngularFirestoreCollection<TabMessage>;
  private BigCollection: AngularFirestoreCollection<BigArray>;
  private PhotoCollection: AngularFirestoreCollection<TabMessage>;
  tabMessage: Observable<TabMessage[]>;
  tabPhoto: Observable<TabMessage[]>;
  bigArray: Observable<BigArray[]>;
  userId: string;

  testGuest: Array<Array<string>> = [];
  testGuest2: Array<Array<string[]>> = [];
  BigArray: Array<Array<Array<string | Array<string | Array<Guest>>> | string | number>> = [];
  testArray2: Array<Array<string | Array<string>> | string | number> = [];

  constructor(private guestService: GuestService, private http: HttpClient,
    private afs: AngularFirestore, private router: Router, private datePipe: DatePipe, private fb: FormBuilder,
    private storage: AngularFireStorage) {
    this.itemsCollection = this.afs.collection<TabMessage>('TableMessage');
    this.tabMessage = this.itemsCollection.valueChanges();
    this.PhotoCollection = this.afs.collection<TabMessage>('TablePhoto');
    this.tabPhoto = this.PhotoCollection.valueChanges();
    this.BigCollection = this.afs.collection<BigArray>('NumTable');
    this.bigArray = this.BigCollection.valueChanges();

  }

  someVariable: Array<Array<string | number>> =[];
  Tableplan : Array<TablePlan> = [];
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
  name: string;
  downloadURL: Observable<any>;
  url: Observable<string []>;

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
    this.BigArray.push([this.table, this.tableName, []]);
    this.table++;
    this.tableName = "";
  }

  onDrop({ dropData }: DropEvent<Guest>, item): void {
    alert("Table A" + item + " " + dropData.guestName)
    this.BigArray[item][2].push([dropData.guestName, dropData.userId]);
    this.removeItem(dropData, this.guests);
    this.guestsTemp.push(dropData);
  }

  removeItem(item: any, list: Array<any>) {
    let index = list.map(function (e) {
      return e.guestName
    }).indexOf(item.guestName);
    list.splice(index, 1);
  }


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
      alert("Broadcast message is success");
    }).catch(err => {
      if(err.status == 200){
        alert('Broadcast table is sucess');
        this.dateTab = this.datePipe.transform(new Date(),"MMM d, y, h:mm:ss a");
        this.itemsCollection.add({path: "Table name : "+tables[1], id: table[1], date: this.datePipe.transform(new Date(),"MMM d, y, h:mm:ss a")});
        // this.BigCollection.add({path: BigArray, date:this.datePipe.transform(new Date(),"MMM d, y, h:mm:ss a")});
        console.log(this.itemsCollection);
        // console.log(this.BigCollection);
      }else{
      alert('Something went wrong:'+ JSON.stringify(err));
      }
    });
     }
       }
    }

    screenshot(){
      html2canvas(document.getElementById('container')).then(canvas=> {
        document.body.appendChild(canvas);
        // console.log(html2canvas);

        // Get base64URL
        var base64URL = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream'); 
        console.log(base64URL);

        // this.name = Math.random().toString(36).substring(2);
        const ref = this.storage.ref(base64URL);
        this.downloadURL = this.storage.ref(base64URL).getDownloadURL();
        console.log(this.downloadURL);
        //this.PhotoCollection.add({path: "https://firebasestorage.googleapis.com/v0/b/line-bot-a451a.appspot.com/o/"+this.name+"?alt=media", id: this.tables[1], date: this.datePipe.transform(new Date(),"MMM d, y, h:mm:ss a")});
      });
    }
    getDownloadUrl(file){
      this.url = this.storage.ref(file).getDownloadURL();
     return this.storage.ref(file).getDownloadURL();
    }
   

    //capture all of screen
    // screenshot(){
    //   html2canvas(document.body).then(function(canvas) {
    //   document.body.appendChild(canvas);

    //     var base64URL = canvas.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream'); 
    //     console.log(base64URL);
    //  });
    // }
    
    // screenshot(){
    //   html2canvas(document.getElementById('container')).then(function(canvas) {
    //     document.getElementById("image").src= canvas.toDataURL();

    //     var base64URL = canvas.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream'); 
    //     console.log(base64URL);
    //    });
    // }
  }