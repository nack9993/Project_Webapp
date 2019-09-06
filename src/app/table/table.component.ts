import { Component, OnInit} from '@angular/core';
import { GuestService } from '../guest.service';
import { Guest } from '../Guest';
import { DragAndDropModule, DropEvent } from 'angular-draggable-droppable';
import { DragAxis } from 'angular-draggable-droppable/lib/draggable.directive';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { isNgTemplate } from '@angular/compiler';
import { DatePipe } from '@angular/common';
export interface TabMessage {path: string, date: string};
// export interface TabMessage { userId: string, tableName: string, guestName: string, chairNum: string}
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { stringify } from 'querystring';

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
  constructor(private guestService: GuestService,private http:HttpClient,
    private tab: AngularFirestore,private router: Router,private datePipe: DatePipe,private fb: FormBuilder) {
      this.itemsCollection = this.tab.collection<TabMessage>('TableMessage');
      this.tabMessage = this.itemsCollection.valueChanges();

    }

  someVariable: Array<Array<string | number>> =[];
  values: Array<string | number> = []; 
  table = 0
  tables = []
  chair;
  guests: Guest[];
  guestsTemp: Guest[];
  droppedData: string;
  tableName: string;
  form: FormGroup;
  dateTab: string;
  
  Url = 'https://api.line.me/v2/bot/message/broadcast';  
  headers = new HttpHeaders({'Content-Type': 'application/json',
     'Authorization': 'Bearer GsZpznR0mZamDlPUksPKYtSKq1qtWqILKEPMnZjoHAuOhc5Xsl2wX19eNAffYrNDjxT/f8By9yQVp5ym39wqNo3B/uPWBoURHkpm0MB+MN+Toi5+dE48ennz+ooOPJd7Yfp1u80un7/y/M/2r25GPwdB04t89/1O/w1cDnyilFU='
   ,  "Access-Control-Allow-Origin": "*",
   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
   "Access-Control-Allow-Headers": "X-Requested-With, Content-Type, Authorization"});

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
    this.guestService.getGuests().subscribe( guests => this.guests = guests);
    console.log(this.guests);
  }

  addTable(){
    this.tables.push(this.table);
    this.someVariable.push([this.table,this.tableName])
    this.table++;
    console.log(this.tableName);
    this.tableName= this.someVariable[this.tableName];
  }

  deleteTable(){
    this.tables.pop();
    this.table--;
    this.someVariable.pop();
  }

  onDrop({dropData}: DropEvent<string>,item): void {
    alert("Table A"+item+" "+dropData.guestName)
    this.droppedData = dropData;
    // this.chair = this.someVariable[item][1];
    // this.chair++;
    // this.someVariable[item][1] = this.chair;
    this.someVariable[item].push(dropData.guestName);
    this.someVariable[item].push(dropData.userId);
    this.removeItem(dropData, this.guests);
  }

  removeItem(item: any, list: Array<any>) {
    let index = list.map(function (e) {
      return e.guestName
    }).indexOf(item.guestName);
    list.splice(index, 1);
  }

  sendBroadCastTable(someVariable){
    // for(let table of this.someVariable){ 
      return this.http.post(this.Url, JSON.stringify({
            "messages":[
                {
                    "type":"text",
                    "text":this.someVariable[2]
                },
            ]
        }), this.options).toPromise().then((result) => {
          console.log(result);
          this.dateTab = this.datePipe.transform(new Date(),"MMM d, y, h:mm:ss a");
          this.itemsCollection.add({path: this.someVariable[this.tableName], date: this.datePipe.transform(new Date(),"MMM d, y, h:mm:ss a")})
          alert("Broadcast message is success");
        }).catch(err => {
          alert('Something went wrong:'+ err.message);
        });;
      // } 
  }
  }