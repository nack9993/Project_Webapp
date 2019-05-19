import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule } from '@angular/forms';
import { BroadcastComponent } from './broadcast/broadcast.component';
import { AppRoutingModule } from './app-routing.module';
import { PhotoComponent } from './photo/photo.component';
import { GuestListComponent } from './guest-list/guest-list.component';

@NgModule({
  declarations: [
    AppComponent,
    BroadcastComponent,
    PhotoComponent,
    GuestListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
