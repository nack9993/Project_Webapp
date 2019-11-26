import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable, Timestamp } from 'rxjs';
import { IImage } from 'ng-simple-slideshow';

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
  itemArray : String[];
  i : number = 1;

  height: string = '600px';
  minHeight: string;
  arrowSize: string = '30px';
  showArrows: boolean = true;
  disableSwiping: boolean = false;
  autoPlay: boolean = true;
  autoPlayInterval: number = 3333;
  stopAutoPlayOnSlide: boolean = true;
  debug: boolean = false;
  backgroundSize: string = 'cover';
  backgroundPosition: string = 'center center';
  backgroundRepeat: string = 'no-repeat';
  showDots: boolean = true;
  dotColor: string = '#FFF';
  showCaptions: boolean = true;
  captionColor: string = '#FFF';
  captionBackground: string = 'rgba(0, 0, 0, .35)';
  lazyLoad: boolean = false;
  hideOnNoSlides: boolean = false;
  width: string = '100%';
  fullscreen: boolean = false;
  enableZoom: boolean = false;
  enablePan: boolean = false;
  noLoop: boolean = false;

  constructor(private storage: AngularFireStorage,private afs: AngularFirestore) {
    this.itemsCollection = afs.collection<Item>('photos');
    this.items = this.itemsCollection.valueChanges();
 }

  getDownloadUrl(file){
   this.url = this.storage.ref(file).getDownloadURL();
  return this.storage.ref(file).getDownloadURL();
 }


  
  imageUrls: String [] = [
  ];


  ngOnInit() {
    this.getPhoto();
  }

  getPhoto(){
    this.items.subscribe(res=> {for(var i =0;i <res.length;i++ ){
      this.text = res[i].path;
      this.imageUrls.push(this.text);
    }
    }
    )
  }


}
