import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BroadcastComponent} from './broadcast/broadcast.component';
import {PhotoComponent} from './photo/photo.component';

const routes: Routes = [
  { path: 'broadcast', component: BroadcastComponent },
  {path: 'photo' , component: PhotoComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}