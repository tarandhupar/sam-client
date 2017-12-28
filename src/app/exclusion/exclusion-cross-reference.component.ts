import { HostListener, Component, ElementRef, Input, Renderer, OnInit } from '@angular/core';

@Component({
  selector: 'exclusionCrossReference',
  templateUrl: 'exclusion-cross-reference.html',
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
	    if(this.crossReference.exclusionType == 'Ineligible (Proceedings Pending)')
	    {
	    	this.typeConcat = '1';
	    }
	    else if(this.crossReference.exclusionType == 'Ineligible (Proceedings Completed)')
	    {
	    	this.typeConcat = '2';
	    }
	    else if(this.crossReference.exclusionType == 'Prohibition/Restriction')
	    {
	    	this.typeConcat = '3';
	    }
	    else if(this.crossReference.exclusionType == 'Voluntary Exclusion')
	    {
	    	this.typeConcat = '4';
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
