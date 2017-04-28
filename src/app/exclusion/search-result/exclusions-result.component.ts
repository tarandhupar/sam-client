import { Component,Input,OnInit } from '@angular/core';
import 'rxjs/add/operator/map';
import * as moment from 'moment/moment';

@Component({
  moduleId: __filename,
  selector: 'exclusions-result',
  template: `  	
  	<div class="sam-ui grid">
  	  <div class="row">
  	    <div class="eight wide column">
          <h3 class="exclusion-title">
            <a *ngIf="data.isActive==true" [routerLink]="['/exclusions', uniqueIdentifier]" [queryParams]="qParams">
              {{ data.name }}
            </a>
            <span *ngIf="data.isActive==false">{{ data.name }}</span>
          </h3>
          <ul class="sam-ui small list">
            <li *ngIf="data.dunsNumber!==null && data.dunsNumber!==''">
              <strong>DUNS</strong><br>
              {{ data.dunsNumber }}
            </li>
            <li *ngIf="data.cageCode!==null && data.cageCode!==''">
              <strong>CAGE Code</strong><br>
              {{ data.cageCode }}
            </li>
            <li>
              <strong>Address: </strong><br>
              {{ data.address.streetAddress }}
              <ng-container *ngIf="data.address?.city && data.address?.streetAddress">,</ng-container> 
              {{ data.address.city }}
              <ng-container *ngIf="data.address?.state && data.address?.city">,</ng-container> 
              {{ data.address.state}} {{data.address.zip}}
            </li>
          </ul>
  	    </div>
  	    <div class="four wide column">
          <ul class="sam-ui small list">             
            <li *ngIf="data.isActive==false" >
              <span class="sam-ui mini label">Inactive</span>
            </li>
            <li>
              <span class="sam-ui mini label">Exclusion</span>
            </li>
            <li *ngIf="data.classification.code!==null && data.classification.code!==''">
              <strong>Classification</strong><br>
              {{ data.classification.code }}
            </li> 
            <li *ngIf="data.activationDate!==null">
              <strong>Activation Date</strong><br>
              {{ data.activationDate }}
            </li>    
            <li>
              <strong>Termination Date</strong><br>
              {{ data.terminationDate !== null ? data.terminationDate : 'Indefinite' }}
            </li>      
          </ul>
        </div>
  	  </div>
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
