import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

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
  uploadProgress: Observable<number>;
  downloadURL: Observable<any>;
  randomId : string;
  

  constructor(private http:HttpClient,private storage: AngularFireStorage, private router: Router) { }

  ngOnInit() {
  }

   upload(event) {
    this.randomId = Math.random().toString(36).substring(2);
    const ref = this.storage.ref(this.randomId);
    this.task = ref.put(event.target.files[0]);
    this.uploadProgress = this.task.percentageChanges();
    setTimeout( () => {
      this.downloadURL = this.storage.ref(this.randomId).getDownloadURL();
      this.uploadStatus = true;
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
              "originalContentUrl":'https://firebasestorage.googleapis.com/v0/b/line-bot-a451a.appspot.com/o/'+this.randomId+'?alt=media',
              "previewImageUrl":'https://firebasestorage.googleapis.com/v0/b/line-bot-a451a.appspot.com/o/'+this.randomId+'?alt=media'
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
}
