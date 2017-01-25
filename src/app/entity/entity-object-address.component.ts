import { HostListener, Component, ElementRef, Input, Renderer, OnInit } from '@angular/core';

@Component({
  selector: 'entityObjectAddress',
  template: `
  {{address.address1}}
  <br />
  {{address.addressCity}}<div *ngIf="address.addressCity" class="display-inline">&#44; </div>{{address.addressState}} {{address.addressZip}}<div *ngIf="address.addressZipPlus4" class="display-inline">&#45;</div>{{address.addressZipPlus4}}
  <br />
  {{address.country}}
  `
})
export class EntityObjectAddress implements OnInit {
  
  @Input() address: any;

  constructor( ) {}

  ngOnInit(){
  }

}
