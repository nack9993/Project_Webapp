import { Component, OnInit } from '@angular/core';
import { TabPicture, TabMessage } from '../table/table.component';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  private PhotoCollection: AngularFirestoreCollection<TabPicture>;
  private itemsCollection: AngularFirestoreCollection<TabMessage>;
  tabMessage: Observable<TabMessage[]>;
  tabPhoto: Observable<TabPicture[]>;

  constructor(private db: AngularFireDatabase,private afs: AngularFirestore) {
    this.PhotoCollection = this.afs.collection<TabPicture>('TablePhoto');
    this.tabPhoto = this.PhotoCollection.valueChanges();
    this.itemsCollection = this.afs.collection<TabMessage>('TableMessage');
    this.tabMessage = this.itemsCollection.valueChanges();
    console.log(this.tabPhoto);
    console.log(this.tabMessage);
   }
TableMessage: any[];
TablePhoto: any[];
  ngOnInit() {
    this.db.list('/TableMessage').valueChanges()
    .subscribe(list=>{
      this.TableMessage = list;
      console.log(this.TableMessage);
    })
    this.db.list('/TablePhoto').valueChanges()
    .subscribe(list=>{
      this.TablePhoto = list;
      console.log(this.TablePhoto);
    })
  }

}
