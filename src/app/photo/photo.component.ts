import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable, Timestamp } from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';
import { JsonPipe } from '@angular/common';

export interface Item { path: string; }

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit {
  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  url: Observable<string []>;
  text: String;

  constructor(private storage: AngularFireStorage,private afs: AngularFirestore) {
    this.itemsCollection = afs.collection<Item>('photos');
    this.items = this.itemsCollection.valueChanges();
    console.log(this.items);
 }

  getDownloadUrl(file){
   this.url = this.storage.ref(file).getDownloadURL();
  return this.storage.ref(file).getDownloadURL();
 }



  ngOnInit() {
  }



}
