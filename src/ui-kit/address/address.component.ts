import { HostListener, Component, ElementRef, Input, Renderer, OnInit } from '@angular/core';

@Component({ selector: 'samAddress',
  template: `
  <div class="sam-address">
    {{data.title}} {{data.fullName}} <br>{{data.address}}, <br> {{data.city}}, {{data.state}} {{data.zip}}<br>
    <strong>Email:</strong> <a href="mailto:{{data.email}}">{{data.email}}</a> <br>
    <strong>Phone:</strong> {{data.phone}}<br>
    <span *ngIf="data.fax"><strong>Fax:</strong> {{data.fax}}<br></span><br>
  </div>
  `
})
export class SamAddressComponent implements OnInit {
  
  @Input() data: any;

  constructor( ) {}

  ngOnInit(){
  }

}
