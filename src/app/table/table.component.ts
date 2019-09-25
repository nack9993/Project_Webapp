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
  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;

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

      // this.downloadLink.nativeElement.download = 'marble-diagram.png';
      // this.downloadLink.nativeElement.click();

    });
  }
  task: AngularFireUploadTask;
  message: string;
  private itemsCollection: AngularFirestoreCollection<TabMessage>;
  private BigCollection: AngularFirestoreCollection<BigArray>;
  private PhotoCollection: AngularFirestoreCollection<TabMessage>;
  tabMessage: Observable<TabMessage[]>;
  tabPhoto: Observable<TabMessage[]>;
  bigArray: Observable<BigArray[]>;
  userId: string;

  BigArray: Array<Array<Array<string | Array<string | Array<Guest>>> | string | number>> = [];


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
    this.objectName = "";
  }

  addTable() {
    this.BigArray.push([this.table, this.tableName, []]);
    this.table++;
    this.tableName = "";
  }

  onDrop({ dropData }: DropEvent<Guest>, item, tableName): void {
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
    this.screenshot();
    console.log(this.BigArray.length)
    if (this.BigArray.length !== 0) {
      for (let tables of this.BigArray) {
        for (let table of tables[2]) {
         this.sendPushMessageForEachGuest(table,tables);
        }
        await this.delay(3000);
      }
      alert('Broadcast table is sucess');
    }
  }

    transform(base64Image){
      return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + base64Image);
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