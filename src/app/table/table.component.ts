import { Component, OnInit} from '@angular/core';
import { GuestService } from '../guest.service';
import { Guest } from '../Guest';
import { DragAndDropModule, DropEvent } from 'angular-draggable-droppable';
import { DragAxis } from 'angular-draggable-droppable/lib/draggable.directive';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})


export class TableComponent implements OnInit {
  message: any;
  constructor(private guestService: GuestService,private http:HttpClient) {  }

  someVariable: Array<Array<string | number>> =[];
  values: Array<string | number> = []; 
  table = 0
  tables = []
  chair;
  guests: Guest[];
  guestsTemp: Guest[];
  droppedData: string;

  
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
    this.getGuests();
  }

  getGuests(): void {
    this.guestService.getGuests().subscribe( guests => this.guests = guests);
    console.log(this.guests);
  }

  addTable(){
    this.tables.push(this.table);
    this.someVariable.push(["A"+this.table,0])
    this.table++;
    console.log(this.someVariable);
  }

  deleteTable(){
    this.tables.pop();
    this.table--;
    this.someVariable.pop();
  }

  onDrop({dropData}: DropEvent<string>,item): void {
    alert("Table A"+item+" "+dropData.guestName)
    this.droppedData = dropData;
    this.chair = this.someVariable[item][1];
    this.chair++;
    this.someVariable[item][1] = this.chair;
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

  sendBroadCastTable(){
    for(let table of this.someVariable){
    console.log("Your table is "+table[0]);
    }

  //   return this.http.post(this.Url, JSON.stringify({
  //     "messages":[
  //         {
  //             "type":"text",
  //             "text":this.message
  //         },
  //     ]
  // }), this.options).toPromise().then((result) => {
  //   console.log(result);
  //   alert("Broadcast message is success");
  // }).catch(err => {
  //   alert('Something went wrong:'+ err.message);
  // });;
  }

}
