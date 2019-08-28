import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import {AngularFireModule} from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BroadcastComponent } from './broadcast/broadcast.component';
import { AppRoutingModule } from './app-routing.module';
import { PhotoComponent } from './photo/photo.component';
import { GuestListComponent } from './guest-list/guest-list.component';
import { HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './auth.service';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { TableComponent } from './table/table.component';
import { ContactComponent } from './contact/contact.component';
import { AngularFireStorageModule} from 'angularfire2/storage';
import { WishComponent } from './wish/wish.component';
import { AdminComponent } from './admin/admin.component';
import { DragAndDropModule } from 'angular-draggable-droppable';
import { DatePipe } from '@angular/common';
import { AngularFireDatabaseModule } from 'angularfire2/database';

@NgModule({
  declarations: [
    AppComponent,
    BroadcastComponent,
    PhotoComponent,
    GuestListComponent,
    RegisterComponent,
    LoginComponent,
    NavbarComponent,
    HomeComponent,
    TableComponent,
    ContactComponent,
    WishComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
    AngularFireAuthModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    DragDropModule ,
    DragAndDropModule
  ],
  providers: [AuthService,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
