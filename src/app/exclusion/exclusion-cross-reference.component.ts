import { HostListener, Component, ElementRef, Input, Renderer, OnInit } from '@angular/core';

@Component({
  selector: 'exclusionCrossReference',
  template: `
		<div>
			<a [routerLink]="['/exclusions', uniqueIdentifier]" [queryParams]="qParams">
			{{crossReference.identityInfo.companyName}}</a>
			<br />
			<strong>Cross Reference Type: </strong>{{crossReference.crossReferenceType}}
			<br />
			<strong>Excluding Agency: </strong>{{crossReference.excludingAgencyName}}
			<br />
			<strong>Exclusion Type: </strong>{{crossReference.exclusionType}}
			<br />
			<strong>Active Date: </strong>{{crossReference.activateDate}}
			<br />
			<strong>Termination Date: </strong>{{crossReference.terminationDate}}
			<br />
			<br />
		</div>
  `
})
export class ExclusionCrossReference implements OnInit {
  
  @Input() crossReference: any;
  uniqueIdentifier: string;
  samNumberConcat:string;
  orgIdConcat:string;
  typeConcat:string;
  cageCodeConcat:string;
  constructor( ) {}

  ngOnInit(){

     if(this.crossReference.excludingAgencyCode!=null && this.crossReference.excludingAgencyCode.length > 0){
      this.orgIdConcat=this.crossReference.excludingAgencyCode;
    }
    else {
      this.orgIdConcat='NA';
    }

    if(this.crossReference.samNumber!=null && this.crossReference.samNumber.length > 0){
      this.samNumberConcat=this.crossReference.samNumber
    }
    else {
      this.samNumberConcat='NA';
    }

    //Refactor this later with appropriate solution
    if(this.crossReference.exclusionType!=null && this.crossReference.exclusionType.length > 0){
      if(this.crossReference.exclusionType.indexOf("/")>-1) {
        this.typeConcat = this.crossReference.exclusionType.replace(/[/]/g, "SLASH");
      } else {
        this.typeConcat = this.crossReference.exclusionType;
      }
    }
    else {
      this.typeConcat='NA';
    }

    if(this.crossReference.ctCode!=null && this.crossReference.ctCode.length > 0){
      this.cageCodeConcat=this.crossReference.ctCode;
    }
    else {
      this.cageCodeConcat='NA';
    }

    this.uniqueIdentifier=this.samNumberConcat + '+' + this.orgIdConcat + '+' + this.typeConcat + '+' + this.cageCodeConcat;
  }

}
