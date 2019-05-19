import { Component, OnInit } from '@angular/core';
import { GuestService } from '../guest.service';
import { Guest } from '../Guest';

@Component({
  selector: 'app-guest-list',
  templateUrl: './guest-list.component.html',
  styleUrls: ['./guest-list.component.scss']
})
export class GuestListComponent implements OnInit {
  constructor(private guestService: GuestService) { 
  }


  ngOnInit() {
    this.getGuests();
  }

  guests: Guest[];

  getGuests(): void {
    this.guestService.getGuests().subscribe( guests => this.guests = guests);
  }
}
