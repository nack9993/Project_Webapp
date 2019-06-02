import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.scss']
})
export class BroadcastComponent implements OnInit {

  image: String;
  constructor() { }

  ngOnInit() {
  }

  onFileChanged(event) {
    const file = event.target.files[0]
    alert(file);
  }

}
