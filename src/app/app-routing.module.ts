import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BroadcastComponent} from './broadcast/broadcast.component';
import {PhotoComponent} from './photo/photo.component';
import { GuestListComponent } from './guest-list/guest-list.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { TableComponent } from './table/table.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { WishComponent } from './wish/wish.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'broadcast', component: BroadcastComponent },
  {path: 'photo' , component: PhotoComponent},
  {path: 'guest' , component: GuestListComponent},
  {path: 'register' , component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path:'table',component:TableComponent},
  {path: 'home', component:HomeComponent},
  {path: 'contact', component:ContactComponent},
  {path: 'wish', component:WishComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}