import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  form: FormGroup;

  constructor(private db: AngularFireDatabase,private fb: FormBuilder,private http: HttpClient) {}
  guests: any;
  CloudUrl = 'https://us-central1-marry-marrige.cloudfunctions.net/WebRequest';
  answer : string;
  userId : string;
  question : string;
  
  ngOnInit() {
    this.form = this.fb.group({
      answer: ['', [Validators.required]]
    })
    this.viewContact();
}

viewContact(){
  this.db.list('/guests').valueChanges()   // returns observable
  .subscribe(list=> {
  this.guests = list;
  console.log(this.guests);
  })
}

setUserId(userId){
this.userId = userId;
}

setQuestion(question){
  this.question = question;
  }

sendAnswerToGuest(question,userId,answer){
  console.log(this.userId+ "" + this.answer);
  return this.http.post(this.CloudUrl, JSON.stringify({
           "to": this.userId,
           "messages": [
            {
              "type":"text",
              "text":"Question : " + this.question
             },
             {
               "type": "text",
               "text": "Answer : " + this.answer
             },
           ]
         })).toPromise().then((result) => {
         }).catch(err => {
           if (err.status == 200) {
             alert('Answer is success!!');
            //  this.dateMessage = this.datePipe.transform(new Date(),"MMM d, y, h:mm:ss a");
            //  this.itemsCollection.add({NameOfTable: tables[1], id: table[1], date: this.datePipe.transform(new Date(),"MMM d, y, h:mm:ss a")});
             return('Broadcast table is sucess');
           } else {
             console.log('Something went wrong:' + JSON.stringify(err));
             return('Something went wrong:' + JSON.stringify(err));
           }
         });
        }


}
