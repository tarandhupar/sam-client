import { HostListener, Component, ElementRef, Input, Renderer, OnInit } from '@angular/core';

@Component({
  selector: 'exclusionAddress',
  template: `
  {{address.addressCity}}<div *ngIf="address.addressCity" class="display-inline">&#44; </div>{{address.addressState}} {{address.addressZip}}<div *ngIf="address.addressZipPlus4" class="display-inline">&#45;</div>{{address.addressZipPlus4}}
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
