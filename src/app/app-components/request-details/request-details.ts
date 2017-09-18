import { Component, Input } from "@angular/core";

@Component({
  selector: 'request-details',
  templateUrl: './request-details.html'
})
export class RequestDetailsComponent {
  @Input() requestObject: any;

  constructor() { }

  ngOnInit() {

  }


}
