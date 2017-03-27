import { HostListener, Component, ElementRef, Input, Renderer, OnInit } from '@angular/core';

@Component({
  selector: 'awardsAddress',
  template: `
  {{address.street}}
  <br />
  <div *ngIf="address.street2">
  	{{address.street2}}
  </div>
  {{address.city}}<div *ngIf="address.city" class="display-inline">&#44; </div>{{address.state}} {{address.zip}}
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