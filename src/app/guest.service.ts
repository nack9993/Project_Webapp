import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Guest } from './Guest';
import { environment } from '../../src/environments/environment';
import { AngularFireDatabase,AngularFireList  } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class GuestService {
  private guest: AngularFireList<Guest[]>
  
  constructor(private http: HttpClient,private db: AngularFireDatabase) { }

  getGuests(): Observable<Guest[]> {
    let guestDB = this.http.get<Guest[]>(environment.nodeServer + '/guests');
    return guestDB;
  }
}
