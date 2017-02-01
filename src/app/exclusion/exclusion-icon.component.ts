import { HostListener, Component, ElementRef, Input, Renderer, OnInit } from '@angular/core';

@Component({
  selector: 'exclusionIcon',
  template: `
  <div class="text-algin-center">
	  <span *ngIf="classificationType=='Individual'">
		<i class="fa fa-user fa-5x" ></i>
		<br />
		<strong>Individual</strong>
	  </span>
	  <span *ngIf="classificationType=='Firm'">
		<i class="fa fa-building fa-5x" ></i>
		<br />
		<strong>Firm</strong>
	  </span>
	  <span *ngIf="classificationType=='Special Entity Designation'">
		<i class="fa fa-building-o fa-5x" ></i>
		<br />
		<strong>Special Entity Designation</strong>
	  </span>
	  <span *ngIf="classificationType=='Vessel'">
		<i class="fa fa-ship fa-5x" ></i>
		<br />
		<strong>Vessel</strong>
	  </span>
  <div>
  `
})
export class ExclusionIcon implements OnInit {
  
  @Input() classificationType: any;

  constructor( ) {}

  ngOnInit(){
  }

}
