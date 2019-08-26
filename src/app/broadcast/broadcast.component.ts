import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Item } from '../photo/photo.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.scss']
})
export class BroadcastComponent implements OnInit {
  
  uploadStatus : boolean = false;
  message : string;
  @Input() file: File;

  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;

  image: String;
  Url = 'https://api.line.me/v2/bot/message/broadcast';  // URL to web api
 headers = new HttpHeaders({'Content-Type': 'application/json',
    'Authorization': 'Bearer GsZpznR0mZamDlPUksPKYtSKq1qtWqILKEPMnZjoHAuOhc5Xsl2wX19eNAffYrNDjxT/f8By9yQVp5ym39wqNo3B/uPWBoURHkpm0MB+MN+Toi5+dE48ennz+ooOPJd7Yfp1u80un7/y/M/2r25GPwdB04t89/1O/w1cDnyilFU='
  ,  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "X-Requested-With, Content-Type, Authorization"});

  options = {
    headers: this.headers
  }
  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  uploadProgress: Observable<number>;
  downloadURL: Observable<any>;
  url: Observable<string []>;
  name : string;
  
  constructor(private datePipe: DatePipe,private http:HttpClient,private storage: AngularFireStorage, private router: Router,private afs: AngularFirestore) {
    this.itemsCollection = this.afs.collection<Item>('BroadcastPhoto');
     this.items = this.itemsCollection.valueChanges();
     console.log(this.items);
  }
  
  ngOnInit() {
  }

   upload(event) {
    this.name = this.datePipe.transform(new Date(),"MMM d, y, h:mm:ss a");
    const ref = this.storage.ref(this.name);
    this.task = ref.put(event.target.files[0]);
    this.uploadProgress = this.task.percentageChanges();
    setTimeout( () => {
      this.downloadURL = this.storage.ref(this.name).getDownloadURL();
      this.uploadStatus = true;
      this.itemsCollection = this.afs.collection<Item>('BroadcastPhoto');
     this.items = this.itemsCollection.valueChanges();
     this.itemsCollection.add({path: this.name });
  }, 3000);
  }

  submit(message){
    return this.http.post(this.Url, JSON.stringify({
      "to": "U927911d27fba066bde65dd5e0780c8b0",
      "messages":[
          {
              "type":"text",
              "text":this.message
          }
      ]
  }), this.options).toPromise().then((result) => {
    console.log(result);
    this.router.navigate(['/home']);
    alert("Broadcast message is success");
  }).catch(err => {
    alert('Something went wrong:'+ err.message);
    this.router.navigate(['/home']);
  });;
  }

  submitPicture(randomId){
    return this.http.post(this.Url, JSON.stringify({
      "to": "U927911d27fba066bde65dd5e0780c8b0",
      "messages":[
          {
              "type":"image",
              "originalContentUrl":'https://firebasestorage.googleapis.com/v0/b/line-bot-a451a.appspot.com/o/'+this.name+'?alt=media',
              "previewImageUrl":'https://firebasestorage.googleapis.com/v0/b/line-bot-a451a.appspot.com/o/'+this.name+'?alt=media'
          }
      ]
  }), this.options).toPromise().then( (result) => {
    console.log(JSON.stringify(result));
    alert("Broadcast picture is success");
    this.router.navigate(['/home']);
  }).catch(err => {
    alert('Something went wrong:'+ err.message);
    this.router.navigate(['/home']);
  });;
  }

  getDownloadUrl(file){
    this.url = this.storage.ref(file).getDownloadURL();
   return this.storage.ref(file).getDownloadURL();
  }
 

}
