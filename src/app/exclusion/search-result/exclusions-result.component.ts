import {Component, Input, OnInit} from '@angular/core';
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
              {{ data.title }}
            </a>
            <span *ngIf="data.isActive==false">{{ data.title }}</span>
          </h3>
          <ul class="sam-ui small list">
            <li *ngIf="data.dunsNumber && data.dunsNumber!==null">
              <strong>Unique Entity Identifier (UEI)</strong><br>
              {{ data.dunsNumber }}
            </li>
            <li *ngIf="isFirm">
              <strong>CAGE Code</strong><br>
              {{ data.cageCode }}
            </li>
            <li>
              <strong>Address</strong><br>
              {{ data.address?.streetAddress }}
              <ng-container *ngIf="data.address?.city && data.address?.streetAddress">,</ng-container> 
              {{ data.address?.city }}
              <ng-container *ngIf="data.address?.state && data.address?.city">,</ng-container> 
              {{ data.address?.state}} {{data.address?.zip}}
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
            <li *ngIf="data.classification?.code!==null && data.classification?.code!==''">
              <strong>Classification</strong><br>
              {{ data.classification.code }}
            </li> 
            <li *ngIf="data.activationDate">
              <strong>Activation Date</strong><br>
              {{ data.activationDate }}
            </li>    
            <li>
              <strong>Termination Date</strong><br>
              {{ data.terminationDate ? data.terminationDate : 'Indefinite' }}
            </li>      
          </ul>
        </div>
  	  </div>
  	</div>
  `
})
export class ExclusionsResult implements OnInit {
  @Input() data: any = {};
  @Input() qParams: any = {};
  uniqueIdentifier: string;
  samNumberConcat: string;
  orgIdConcat: string;
  typeConcat: string;
  ctCodeConcat: string;
  isFirm: boolean = false;

  constructor() {
  }

  ngOnInit() {
    if (this.data.organizationHierarchy && this.data.organizationHierarchy != null && this.data.organizationHierarchy.organizationId != null && this.data.organizationHierarchy.organizationId.length > 0) {
      this.orgIdConcat = this.data.organizationHierarchy.organizationId;
    } else {
      this.orgIdConcat = 'NA';
    }

    if (this.data.samNumber && this.data.samNumber != null && this.data.samNumber.length > 0) {
      this.samNumberConcat = this.data.samNumber;
    } else {
      this.samNumberConcat = 'NA';
    }

    if (this.data.type && this.data.type != null) {
      this.typeConcat = this.data.type.code;
    } else {
      this.typeConcat = 'NA';
    }

    if (this.data.ctCode && this.data.ctCode != null && this.data.ctCode.length > 0) {
      this.ctCodeConcat = this.data.ctCode;
    } else {
      this.ctCodeConcat = 'NA';
    }

    if (this.data.classification && this.data.classification != null && this.data.classification.code === 'Firm') {
      this.isFirm = true;
    }

    this.uniqueIdentifier = this.samNumberConcat + '+' + this.orgIdConcat + '+' + this.typeConcat + '+' + this.ctCodeConcat;

    if (this.data.activationDate) {
      this.data.activationDate = moment(this.data.activationDate).format("MMM D, Y");
    }

    if (this.data.terminationDate) {
      this.data.terminationDate = moment(this.data.terminationDate).format("MMM D, Y");
    }
  }
}
