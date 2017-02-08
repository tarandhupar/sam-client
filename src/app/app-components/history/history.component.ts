import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: 'history',
  templateUrl:'history.template.html'
})
export class HistoryComponent implements OnInit {
  @Input() data: any;

  ngOnInit(): void {
    console.log(this.data);
  }
}
