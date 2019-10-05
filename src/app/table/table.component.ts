import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
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
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { DomSanitizer } from '@angular/platform-browser';

export interface TabMessage { path: string, id: string, date: string };
export interface BigArray { path: string[], date: string }
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})



export class TableComponent implements OnInit {
  @ViewChild('screen', {static: false}) screen: ElementRef;
  @ViewChild('canvas', {static: false}) canvas: ElementRef;
  @ViewChild('downloadLink', {static: false}) downloadLink: ElementRef;

  task: AngularFireUploadTask;
  message: string;
  private itemsCollection: AngularFirestoreCollection<TabMessage>;
  private BigCollection: AngularFirestoreCollection<BigArray>;
  private PhotoCollection: AngularFirestoreCollection<TabMessage>;
  tabMessage: Observable<TabMessage[]>;
  tabPhoto: Observable<TabMessage[]>;
  bigArray: Observable<BigArray[]>;
  userId: string;

  TableArray: Array<Array<Array<string | Array<string | Array<Guest>>> | string | number>> = [];


  constructor(private guestService: GuestService, private http: HttpClient,
    private afs: AngularFirestore, private router: Router, private datePipe: DatePipe, private fb: FormBuilder,
    private storage: AngularFireStorage, private sanitizer: DomSanitizer) {
    this.itemsCollection = this.afs.collection<TabMessage>('TableMessage');
    this.tabMessage = this.itemsCollection.valueChanges();
    this.PhotoCollection = this.afs.collection<TabMessage>('TablePhoto');
    this.tabPhoto = this.PhotoCollection.valueChanges();
    this.BigCollection = this.afs.collection<BigArray>('NumTable');
    this.bigArray = this.BigCollection.valueChanges();

  }


  someVariable: Array<Array<string | number>> = [];
  Tableplan: Array<TablePlan> = [];
  values: Array<string | number> = [];
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
  name: string;
  downloadURL: Observable<any>;
  url: Observable<string[]>;
  checkTableNameBoolean: boolean =true;
  width: number;
  height: number;

  test: string;
  Url = 'https://api.line.me/v2/bot/message/broadcast';
  CloudUrl = 'https://us-central1-line-bot-a451a.cloudfunctions.net/WebRequest';
  BroadcastPictureUrl = 'https://us-central1-line-bot-a451a.cloudfunctions.net/BroadCastMessage';
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

  addObject() {
    this.objects.push(this.objectName);
    console.log(this.objects)
    this.objectName = "";
  }

  addTable(indexTable, tableName) {
    this.checkTableNameBoolean = true;
    if(this.TableArray.length != 0){
      this.checkTableName(this.tableName);
      if(this.checkTableNameBoolean == true){
        this.TableArray.push([this.table, this.tableName, []]);
      this.table++;
      this.tableName = "";
      }else{
        alert("This table name is already used");
        this.tableName = "";
      }
    }else{
    this.TableArray.push([this.table, this.tableName, []]);
    this.table++;
    this.tableName = "";
    }
  }

  checkTableName(tableName){
    for(var table of this.TableArray){
      if(tableName == table[1]){
        this.checkTableNameBoolean = false;
      }
      }
  }

  onDrop({ dropData }: DropEvent<Guest>, item, tableName): void {
    alert("Table " + tableName + " " + dropData.guestName)
    this.TableArray[item][2].push([dropData.guestName, dropData.userId]);
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
    console.log(item);
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

  
   delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

  async  sendBroadCastTable() {
    console.log(this.TableArray);
    if(this.TableArray.length != 0 ){
      this.screenshot();
      console.log(this.TableArray.length)
      if (this.TableArray.length !== 0) {
        for (let tables of this.TableArray) {
          for (let table of tables[2]) {
           this.sendPushMessageForEachGuest(table,tables);
          }
          await this.delay(3000);
        }
        alert('Broadcast table is sucess');
      }
    }else{
      alert("Please making a table plan first")
    }
  }

  sendPushMessageForEachGuest(table,tables){
   return this.http.post(this.CloudUrl, JSON.stringify({
            "to": table[1],
            "messages": [
              {
                "type": "text",
                "text": "You Table name is : " + tables[1]
              },
            ]
          })).toPromise().then((result) => {
            console.log(result);
            console.log("Broadcast message is success");
          }).catch(err => {
            if (err.status == 200) {
              console.log('Broadcast table is sucess');
            } else {
              console.log('Something went wrong:' + JSON.stringify(err));
            }
          });
  }

  //รวม 2 ตัวนี้ได้

  screenshot() {
    html2canvas(this.screen.nativeElement).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');

      canvas.toBlob((blob => {
        const ref = this.storage.ref("Test");
        this.task = ref.put(blob);
        return this.http.post(this.BroadcastPictureUrl, JSON.stringify({
          "messages":[
            {
                "type":"image",
                "originalContentUrl":'https://firebasestorage.googleapis.com/v0/b/line-bot-a451a.appspot.com/o/Test?alt=media',
                "previewImageUrl":'https://firebasestorage.googleapis.com/v0/b/line-bot-a451a.appspot.com/o/Test?alt=media'
            }
        ]
        })).toPromise().then((result) => {
          console.log(result);
          alert("Broadcast message is success");
        }).catch(err => {
          if (err.status == 200) {
            alert('Table Plan is successfully');
          } else {
            alert('Something went wrong:' + JSON.stringify(err));
          }
        });
      }));
    });
  }
}