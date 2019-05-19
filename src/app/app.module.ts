import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import {AngularFireModule} from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule } from '@angular/forms';
import { BroadcastComponent } from './broadcast/broadcast.component';
import { AppRoutingModule } from './app-routing.module';
import { PhotoComponent } from './photo/photo.component';
import { GuestListComponent } from './guest-list/guest-list.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    BroadcastComponent,
    PhotoComponent,
    GuestListComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
