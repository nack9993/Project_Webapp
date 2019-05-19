import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BroadcastComponent} from './broadcast/broadcast.component';
import {PhotoComponent} from './photo/photo.component';
import { GuestListComponent } from './guest-list/guest-list.component';

const routes: Routes = [
  { path: 'broadcast', component: BroadcastComponent },
  {path: 'photo' , component: PhotoComponent},
  {path: 'guest' , component: GuestListComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}