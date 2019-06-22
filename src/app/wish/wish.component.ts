import { Component, OnInit } from '@angular/core';
import { GuestService } from '../guest.service';
import { Guest } from '../Guest';

@Component({
  selector: 'app-wish',
  templateUrl: './wish.component.html',
  styleUrls: ['./wish.component.scss']
})
export class WishComponent implements OnInit {

  constructor(private guestService: GuestService) {}

    ngOnInit() {
      this.getGuests();
    }

     guests: Guest[];

  getGuests(): void {
    this.guestService.getGuests().subscribe( guests => this.guests = guests);
    console.log(this.guests);
  }

}
