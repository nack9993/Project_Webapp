import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Guest } from './Guest';
import { environment } from './src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  constructor(private http: HttpClient) { }

  getGuests(): Observable<Guest[]> {
    let guestDB = this.http.get<Guest[]>(environment.nodeServer + '/guests');
    return guestDB;
  }
}
