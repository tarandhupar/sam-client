import { HostListener, Component, ElementRef, Input, Renderer, OnInit } from '@angular/core';

@Component({
  selector: 'exclusionCrossReference',
  template: `
		<div>
			<a>{{crossReference.identityInfo.companyName}}</a>
			<br />
			<strong>Cross Reference Type: </strong>{{crossReference.crossReferenceType}}
			<br />
			<strong>Excluding Agency: </strong>{{crossReference.excludingAgency}}
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

  constructor( ) {}

  ngOnInit(){
  }

}
