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
import { AngularFireDatabase } from 'angularfire2/database';

export interface TabMessage { NameOfTable: string, id: string, date: string };
export interface TabPicture { path: string,  date: string };
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
  private PhotoCollection: AngularFirestoreCollection<TabPicture>;
  tabMessage: Observable<TabMessage[]>;
  tabPhoto: Observable<TabPicture[]>;
  bigArray: Observable<BigArray[]>;
  userId: string;
  dateMessage: string;

  TableArray: Array<Array<Array<string | Array<string | Array<Guest>>> | string | number>> = [];
  ObjectArray: Array<string[]>=[]


  
  constructor(private guestService: GuestService, private http: HttpClient,
    private afs: AngularFirestore, private router: Router, private datePipe: DatePipe, private fb: FormBuilder,
    private storage: AngularFireStorage, private sanitizer: DomSanitizer,private db: AngularFireDatabase) {
    this.itemsCollection = this.afs.collection<TabMessage>('TableMessage');
    this.tabMessage = this.itemsCollection.valueChanges();
    this.PhotoCollection = this.afs.collection<TabPicture>('TablePhoto');
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

  guests: any[] = [];
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

  color: string = "#D3B3B8";
  objectColor: string = "#b3d3ce"

  test: string;
  Url = 'https://api.line.me/v2/bot/message/broadcast';
  CloudUrl = 'https://us-central1-marry-marrige.cloudfunctions.net/WebRequest';
  BroadcastPictureUrl = 'https://us-central1-marry-marrige.cloudfunctions.net/BroadCastMessage';
  headers = new HttpHeaders({
    // "Access-Control-Allow-Origin": "*"
  });

  options = {
    headers: this.headers
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      color:['', [Validators.required]]
    })

    this.Objectform = this.fb.group({
      objectName: ['', [Validators.required]],
      objectColor:['',[Validators.required]]
    })

    this.getGuests();
  }

  getGuests(): void {
    this.db.list('/guests').valueChanges()   // returns observable
    .subscribe(list=> {
    this.guests = list;
    })
  }

  addObject() {
    this.ObjectArray.push([this.objectName,this.objectColor]);
    console.log(this.ObjectArray)
    this.objectName = "";
    return this.objects;
  }

  addTable(indexTable, tableName) {
    this.checkTableNameBoolean = true;
    if(this.TableArray.length != 0){
      this.checkTableName(this.tableName);
      if(this.checkTableNameBoolean == true){
        this.TableArray.push([this.table, this.tableName, [], this.color]);
      this.table++;
      this.tableName = "";
      console.log(this.TableArray);
      return(this.TableArray);
      }else{
        alert("This table name is already used");
        this.tableName = "";
        return("This table name is already used");
      }
    }else{
    // this.TableArray.push([this.table, this.tableName, []]);
    this.TableArray.push([this.table, this.tableName, [],this.color]);
    this.table++;
    this.tableName = "";
    console.log(this.TableArray);
    return(this.TableArray);
    }
  }

  checkTableName(tableName){
    for(var table of this.TableArray){
      if(tableName == table[1]){
        this.checkTableNameBoolean = false;
      }
      }
  }

  onDrop({ dropData }: DropEvent<Guest>,selectedTable) {
    alert("Table " + selectedTable[1] + " " + dropData.guestName)

    this.TableArray[this.TableArray.indexOf(selectedTable)][2].push([dropData.guestName, dropData.userId]);

    this.removeGuest(dropData, this.guests);
    this.guestsTemp.push(dropData);
    console.log(this.TableArray);
    return(this.TableArray);
  }

  removeGuest(item: any, list: Array<any>) {
    console.log(item);
    let index = list.map(function (e) {
      return e.guestName
    }).indexOf(item.guestName);
    list.splice(index, 1);
    console.log(list);
    return list;
  }

  removeObject(item: any, list: Array<any>) {
    console.log(item);
    let index = list.map(function (e) {
      return e
    }).indexOf(item);
    list.splice(index, 1);
    return list;
  }


  removeGuestFromTable(guest: any, list: Array<any>,indexOfTable: any, table) {
    list[list.indexOf(table)][2].splice(list[list.indexOf(table)][2].indexOf(guest), 1);
    let indexOftempGuest = this.guestsTemp.map(function (e) {
      return e.guestName
    }).indexOf(guest[0]);
    this.guests.push(this.guestsTemp[indexOftempGuest]);
    this.guestsTemp.splice(indexOftempGuest, 1);
    return list;
  }

  removeTable(item: any, list: Array<any>) {
    for (var val of list[list.indexOf(item)][2]) {
      let indexOftempGuest = this.guestsTemp.map(function (e) {
        return e.guestName
      }).indexOf(val[0]);
      this.guests.push(this.guestsTemp[indexOftempGuest]);
      // this.guestsTemp.splice(indexOftempGuest,1);
    }
    console.log(this.guestsTemp);
    list.splice(list.indexOf(item), 1);
    this.table--;
    console.log(list);
    return list;
  }

  
   delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

  async  sendBroadCastTable() {
    if(this.TableArray.length != 0 ){
      this.screenshot();
      if (this.TableArray.length !== 0) {
        for (let tables of this.TableArray) {
          for (let table of tables[2]) {
            console.log(table +""+ tables);
           this.sendPushMessageForEachGuest(table,tables);
           
          }
          await this.delay(3000);
        }
        return('Broadcast table is success');
      }
    }else{
      alert("Please making a table plan first")
      return("Please making a table plan first");
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
               alert('Broadcast Table to each guests is successfully');
               this.dateMessage = this.datePipe.transform(new Date(),"MMM d, y, h:mm:ss a");
               this.itemsCollection.add({NameOfTable: tables[1], id: table[1], date: this.datePipe.transform(new Date(),"MMM d, y, h:mm:ss a")});
               return('Broadcast Table to each guests is successfully');
             } else {
               console.log('Something went wrong:' + JSON.stringify(err));
               return('Something went wrong:' + JSON.stringify(err));
             }
           });
          }

    transform(base64Image){
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + base64Image);
  }


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
                "originalContentUrl":'https://firebasestorage.googleapis.com/v0/b/marry-marrige.appspot.com/o/Test?alt=media',
                "previewImageUrl":'https://firebasestorage.googleapis.com/v0/b/marry-marrige.appspot.com/o/Test?alt=media'
            }
        ]
        })).toPromise().then((result) => {
        }).catch(err => {
          if (err.status == 200) {
            alert('Table Plan is successfully');
            this.PhotoCollection.add({path: "https://firebasestorage.googleapis.com/v0/b/marry-marrige.appspot.com/o/Test?alt=media",date : this.datePipe.transform(new Date(),"MMM d, y, h:mm:ss a")});
            return('Table Plan is successfully');
          } else {
            alert('Something went wrong:' + err.status) ;
            return('Something went wrong:' + JSON.stringify(err));
          }
        });
      }));
    });
  }
}