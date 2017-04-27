import { HostListener, Component, ElementRef, Input, Renderer, OnInit } from '@angular/core';

@Component({	
  selector: 'entityObjectPOC',
  template: `
	<div *ngIf="poc.pocType">
		<strong>{{poc.pocType}}</strong>
	</div>
	<div *ngIf="poc.pocFirstName || poc.pocMiddleName || poc.pocLastName">
			<strong>Name: </strong>{{poc.pocFirstName}}<div *ngIf="poc.pocMiddleName" class="display-inline"> {{poc.pocMiddleName}}</div> {{poc.pocLastName}}
	</div>
	<div *ngIf="poc.pocTitle">
		<strong>Title: </strong>{{poc.pocTitle}}
	</div>
	<div *ngIf="poc.pocUSPhone">
		<strong>U.S. Phone: </strong>{{poc.pocUSPhone}}
		<div class="display-inline" *ngIf="poc.pocUSPhoneExt"> ext. {{poc.pocUSPhoneExt}}</div>
	</div>
	<div *ngIf="poc.pocNonUSPhone">
		<strong>Non U.S. Phone: </strong>{{poc.pocNonUSPhone}}
	</div>
	<div *ngIf="poc.pocFax">
		<strong>Fax: </strong>{{poc.pocFax}}
	</div>
	<div *ngIf="poc.pocEmail">
		<strong>Email: </strong>{{poc.pocEmail}}
	</div>
  `
})
export class EntityObjectPOC implements OnInit {
  
  @Input() poc: any;

  constructor( ) {}

  ngOnInit(){
  }

}
