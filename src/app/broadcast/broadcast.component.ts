import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { DatePipe } from '@angular/common';
export interface History { path: string , date : string; }
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.scss']
})
export class BroadcastComponent implements OnInit {
  form: FormGroup;

  uploadStatus : boolean = false;
  message : string;
  @Input() file: File;

  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;

  image: String;
  Url = 'https://api.line.me/v2/bot/message/broadcast';  // URL to web api
  CloudUrl = 'https://us-central1-marry-marrige.cloudfunctions.net/BroadCastMessage';

 headers = new HttpHeaders({});

  options = {
    headers: this.headers
  }
  private itemsCollection: AngularFirestoreCollection<History>;
  private PhotoCollection: AngularFirestoreCollection<History>;
  items: Observable<History[]>;
  messageDBs: Observable<History[]>;
  uploadProgress: Observable<number>;
  downloadURL: Observable<any>;
  url: Observable<string []>;
  name : string;
  dateMessage: string;

  
  constructor(private datePipe: DatePipe,private http:HttpClient,private storage: AngularFireStorage, 
    private router: Router,private afs: AngularFirestore,private fb: FormBuilder) {
    this.PhotoCollection = this.afs.collection<History>('BroadcastPhoto');
     this.items = this.PhotoCollection.valueChanges();
     this.itemsCollection = this.afs.collection<History>('BroadcastMessage');
      this.messageDBs = this.itemsCollection.valueChanges();
 
  }
  
  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required]]
    })
  }

   upload(event) {
    this.name = Math.random().toString(36).substring(2);
    const ref = this.storage.ref(this.name);
    this.task = ref.put(event.target.files[0]);
    this.uploadProgress = this.task.percentageChanges();
    setTimeout( () => {
      this.downloadURL = this.storage.ref(this.name).getDownloadURL();
      this.uploadStatus = true;
      return(this.name);
    //  this.PhotoCollection.add({path: "https://firebasestorage.googleapis.com/v0/b/marry-marrige.appspot.com/o/"+this.name+"?alt=media",date : this.datePipe.transform(new Date(),"MMM d, y, h:mm:ss a")});
  }, 3000);
  }

  sendBroadcastMessage(message){
    return this.http.post(this.CloudUrl, JSON.stringify({
      "messages":[
          {
              "type":"text",
              "text":this.message
          }
      ]
  })).toPromise().then((result) => {
    console.log(result);
    this.router.navigate(['/home']);
    //alert("Broadcast message is success");
  }).catch(err => {
    if(err.status == 200){
      alert('BroadCast message is sucess');
      this.dateMessage = this.datePipe.transform(new Date(),"MMM d, y, h:mm:ss a");
      this.itemsCollection.add({ path: this.message , date : this.datePipe.transform(new Date(),"MMM d, y, h:mm:ss a")});
      this.router.navigate(['/home']);
      return('BroadCast message is sucess');
    }else{
    alert('Something went wrong:'+ JSON.stringify(err));
    this.router.navigate(['/home']);
    return('Something went wrong:'+ JSON.stringify(err));
    }
  });;
  }

  sendBroadcastPicture(name){
    return this.http.post(this.CloudUrl, JSON.stringify({
      "messages":[
          {
              "type":"image",
              "originalContentUrl":'https://firebasestorage.googleapis.com/v0/b/marry-marrige.appspot.com/o/'+this.name+'?alt=media',
              "previewImageUrl":'https://firebasestorage.googleapis.com/v0/b/marry-marrige.appspot.com/o/'+this.name+'?alt=media'
          }
      ]
  })).toPromise().then((result) => {
    console.log(JSON.stringify(result));
    //alert("Broadcast picture is success");
    this.router.navigate(['/home']);
  }).catch(err => {
    if(err.status == 200){
      this.PhotoCollection.add({path: "https://firebasestorage.googleapis.com/v0/b/marry-marrige.appspot.com/o/"+this.name+"?alt=media",date : this.datePipe.transform(new Date(),"MMM d, y, h:mm:ss a")});
      alert('BroadCast Picture is sucess');
      this.router.navigate(['/home']);
      return('BroadCast Picture is sucess');
    }else{
    alert('Something went wrong:'+ JSON.stringify(err));
    this.router.navigate(['/home']);
    return('Something went wrong:'+ JSON.stringify(err));
    }
  });;
  }

  getDownloadUrl(file){
    this.url = this.storage.ref(file).getDownloadURL();
   return this.storage.ref(file).getDownloadURL();
  }
 

}
