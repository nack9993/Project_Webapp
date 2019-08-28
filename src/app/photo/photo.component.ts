import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable, Timestamp } from 'rxjs';

export interface Item { path: string; }

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit {
  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  profileUrl: Observable<string | null>;
  profileUrl2:Observable<string | null>;
  url: Observable<string []>;
  text: String;

  constructor(private storage: AngularFireStorage,private afs: AngularFirestore) {
    this.itemsCollection = afs.collection<Item>('photos');
    this.items = this.itemsCollection.valueChanges();
    
    this.profileUrl = this.getDownloadUrl('0.jpg');
    this.profileUrl2 = this.getDownloadUrl('2019-06-15T04:59:50.337Z.jpg');
 }

  getDownloadUrl(file){
   this.url = this.storage.ref(file).getDownloadURL();
  return this.storage.ref(file).getDownloadURL();
 }



  ngOnInit() {
  }



}
