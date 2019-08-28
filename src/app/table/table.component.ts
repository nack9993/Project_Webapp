import { Component, OnInit} from '@angular/core';
import { GuestService } from '../guest.service';
import { Guest } from '../Guest';
import { DragAndDropModule, DropEvent } from 'angular-draggable-droppable';
import { DragAxis } from 'angular-draggable-droppable/lib/draggable.directive';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})


export class TableComponent implements OnInit {
  constructor(private guestService: GuestService) {  }

  someVariable: Array<Array<string | number>> =[];
  values: Array<string | number> = []; 
  table = 0
  tables = []
  chair;
  guests: Guest[];
  droppedData: string = '';
  
  ngOnInit() {
    this.getGuests();
  }

  getGuests(): void {
    this.guestService.getGuests().subscribe( guests => this.guests = guests);
    console.log(this.guests);
  }

  addTable(){
    this.tables.push(this.table);
    this.someVariable.push(["A"+this.table,0])
    this.table++;
    console.log(this.someVariable);
  }

  deleteTable(){
    this.tables.pop();
    this.table--;
    this.someVariable.pop();
  }

  onDrop({dropData}: DropEvent<string>,item): void {
    console.log('A'+item);
    console.log(dropData);
    alert("Table A"+item+" "+dropData)
    this.droppedData = dropData;
    this.chair = this.someVariable[item][1];
    this.chair++;
    this.someVariable[item][1] = this.chair;
    this.removeItem(dropData, this.guests);
    console.log(this.someVariable[item].push(dropData));
  }

  removeItem(item: any, list: Array<any>) {
    let index = list.map(function (e) {
      return e.name
    }).indexOf(item.name);
    list.splice(index, 1);
  }


}
