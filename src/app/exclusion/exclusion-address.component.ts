import { HostListener, Component, ElementRef, Input, Renderer, OnInit } from '@angular/core';

@Component({
  selector: 'exclusionAddress',
  template: `
  {{address.address1}}<br *ngIf="address.address1" />
  {{address.addressCity}}<span *ngIf="address.addressCity">&#44; </span>
  {{address.addressState}} {{address.addressZip}}
  <span *ngIf="address.addressZipPlus4">&#45;</span>{{address.addressZipPlus4}}
  <br />
  {{address.country}}
  `
})
export class ExclusionAddress implements OnInit {
  
  @Input() address: any;

  constructor( ) {}

  ngOnInit(){
  }

}
