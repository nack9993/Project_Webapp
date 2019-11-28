import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

export interface Contact { userId: string , question : string; }

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  form: FormGroup;

  constructor(private db: AngularFireDatabase,private fb: FormBuilder,private http: HttpClient,private afs: AngularFirestore) {
    this.questionCollection = this.afs.collection<Contact>('contacts');
    this.questions = this.questionCollection.valueChanges();

    // this.contacts = db.list('contacts');
  }

  private questionCollection: AngularFirestoreCollection<Contact>;
  questions: Observable<Contact[]>;

  guests: any;
  CloudUrl = 'https://us-central1-marry-marrige.cloudfunctions.net/WebRequest';
  answer : string;
  userId : string;
  question : string;
  key : string;
  contacts: AngularFireList<any>;

  ngOnInit() {
    this.form = this.fb.group({
      answer: ['', [Validators.required]]
    })
    this.viewContact();
}

viewContact(){
  this.db.list('/contacts').valueChanges()   // returns observable
  .subscribe(list=> {
  this.guests = list;
  console.log(this.guests);
  })
}


setUserId(userId){
this.userId = userId;
console.log(userId)
}

setQuestion(question){
  this.question = question;
  console.log(question)
  }

  setKey(key){
    this.key = key;
    console.log(key)
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
            this.deleteQuestion(this.key);
            this.question = "";
            this.answer = "";
            this.userId = "";
             return('Broadcast table is sucess');
           } else {
            //  console.log('Something went wrong:' + JSON.stringify(err));
            alert("Error : the message is not send to the user");
             this.question = "";
             this.answer = "";
             this.userId = "";
             return('Something went wrong:' + JSON.stringify(err));
           }
         });
        }

        deleteQuestion(key){
          this.db.object("/contacts/"+key).remove();
          console.log(console.log(this.guests));
          // return  this.afs.collection('/contacts').doc(name).delete();
        }

        

}
