import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Item } from '../photo/photo.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  url: Observable<string []>;

  
  constructor(private storage: AngularFireStorage,private afs: AngularFirestore) {
    this.itemsCollection = afs.collection<Item>('photos');
    this.items = this.itemsCollection.valueChanges();
   }

  ngOnInit() {
  }

  click(name,downloadUrl){
   this.delete(name);
   return this.storage.storage.refFromURL(downloadUrl).delete();
  }

  delete(name){
   return  this.afs.collection('photos').doc(name).delete();
  }

  getDownloadUrl(file){
    this.url = this.storage.ref(file).getDownloadURL();
   return this.storage.ref(file).getDownloadURL();
  }
 

}
