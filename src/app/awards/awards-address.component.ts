import { HostListener, Component, ElementRef, Input, Renderer, OnInit } from '@angular/core';

@Component({
  selector: 'awardsAddress',
  template: `
  {{address.street}}
  <br />
  <div *ngIf="address.street2">
  	{{address.street2}}
  </div>
  {{address.City}}<div *ngIf="address.City" class="display-inline">&#44; </div>{{address.state}} {{address.zip | zipCode}}
  <br />
  {{address.country}}
  `
})
export class AwardsAddress implements OnInit {
  
  @Input() address: any;

  constructor( ) {}

  ngOnInit(){
  }

}
