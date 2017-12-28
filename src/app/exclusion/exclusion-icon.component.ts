import { HostListener, Component, ElementRef, Input, Renderer, OnInit } from '@angular/core';

@Component({
  selector: 'exclusionIcon',
  template: `
  <span *ngIf="classificationType=='Individual'">
    <i class="fa fa-user"></i> 
    <strong>Individual</strong>
  </span>
  
  <span *ngIf="classificationType=='Firm'">
    <i class="fa fa-building"></i> 
    <strong>Firm</strong>
  </span>
  
  <span *ngIf="classificationType=='Special Entity Designation'">
    <i class="fa fa-building-o"></i> 
    <strong>Special Entity Designation</strong>
  </span>
  
  <span *ngIf="classificationType=='Vessel'">
    <i class="fa fa-ship"></i> 
    <strong>Vessel</strong>
  </span>
  `
})
export class ExclusionIcon implements OnInit {
  
  @Input() classificationType: any;

  constructor( ) {}

  ngOnInit(){
  }

}
