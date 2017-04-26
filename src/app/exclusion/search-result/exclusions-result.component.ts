import { Component,Input,OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import * as moment from 'moment/moment';

@Component({
  moduleId: __filename,
  selector: 'exclusions-result',
  template: `
      <p>
    	  <span class="usa-label">Exclusion</span>
    	  <span *ngIf="data.isActive==false" class="usa-label">INACTIVE</span>
    	</p>
    	<h3 class="exclusion-title">
    	<a *ngIf="data.isActive==true" [routerLink]="['/exclusions', uniqueIdentifier]" [queryParams]="qParams">{{ data.name }}</a>
      	<span *ngIf="data.isActive==false">{{ data.name }}</span>
    	</h3>
    	<div class="usa-width-two-thirds">
      	<ul class="usa-unstyled-list usa-text-small m_T-3x m_B-2x">
        	<li *ngIf="data.dunsNumber!==null && data.dunsNumber!==''"><strong>DUNS: </strong><span>{{ data.dunsNumber }}</span></li>
          <li *ngIf="data.cageCode!==null && data.cageCode!==''"><strong>CAGE Code: </strong><span>{{ data.cageCode }}</span></li>
          <li><strong>Address: </strong><span>{{ data.address.streetAddress }}<ng-container *ngIf="data.address?.city && data.address?.streetAddress">,</ng-container> {{ data.address.city }}<ng-container *ngIf="data.address?.state && data.address?.city">,</ng-container> {{ data.address.state}} {{data.address.zip}}</span></li>
        </ul>
    	</div>
    	<div class="usa-width-one-third">
      	<ul class="usa-text-small m_B-0">   
          <li *ngIf="data.classification.code!==null && data.classification.code!==''"><strong>Classification</strong>
            <ul class="usa-unstyled-list">
              <li><span>{{ data.classification.code }}</span></li>
            </ul>
          </li> 
          <li *ngIf="data.activationDate!==null"><strong>Activation Date</strong>
            <ul class="usa-unstyled-list">
              <li><span>{{ data.activationDate }}</span></li>
            </ul>
          </li>    
          <li><strong>Termination Date</strong>
            <ul class="usa-unstyled-list">
              <li><span>{{ data.terminationDate !== null ? data.terminationDate : 'Indefinite' }}</span></li>
            </ul>
          </li>      
        </ul>
      </div>
  `
})
export class ExclusionsResult implements OnInit {
  @Input() data: any={};
  @Input() qParams:any = {};
  uniqueIdentifier: string;
  samNumberConcat:string;
  orgIdConcat:string;
  typeConcat:string;
  cageCodeConcat:string;
  constructor() { }

  ngOnInit(){

    if(this.data.organizationHierarchy!=null && this.data.organizationHierarchy.organizationId!=null && this.data.organizationHierarchy.organizationId.length > 0){
      this.orgIdConcat=this.data.organizationHierarchy.organizationId;
    }
    else {
      this.orgIdConcat='NA';
    }

    if(this.data.samNumber!=null && this.data.samNumber.length > 0){
      this.samNumberConcat=this.data.samNumber;
    }
    else {
      this.samNumberConcat='NA';
    }

    //Refactor this later with appropriate solution
    if(this.data.type!=null && this.data.type.length > 0){
      if(this.data.type.indexOf("/")>-1) {
        this.typeConcat = this.data.type.replace(/[/]/g, "SLASH");
      } else {
        this.typeConcat = this.data.type;
      }
    }
    else {
      this.typeConcat='NA';
    }

    if(this.data.cageCode!=null && this.data.cageCode.length > 0){
      this.cageCodeConcat=this.data.cageCode;
    }
    else {
      this.cageCodeConcat='NA';
    }

    this.uniqueIdentifier=this.samNumberConcat + '+' + this.orgIdConcat + '+' + this.typeConcat + '+' + this.cageCodeConcat;


    if(this.data.activationDate!==null) {
      this.data.activationDate = moment(this.data.activationDate).format("MMM D, Y");
    }
    if(this.data.terminationDate!==null) {
      this.data.terminationDate = moment(this.data.terminationDate).format("MMM D, Y");
    }
  }
}
