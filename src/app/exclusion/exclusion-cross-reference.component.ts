import { HostListener, Component, ElementRef, Input, Renderer, OnInit } from '@angular/core';

@Component({
  selector: 'exclusionCrossReference',
  template: `
		<div>
			<a href="">{{crossReference.excludingAgency}}</a>
			<br />
			<strong>Cross Reference Type: </strong>{{crossReference.classificationType}}
			<br />
			<strong>Excluding Agency: </strong>{{crossReference.excludingAgency}}
			<br />
			<strong>Exclusion Type: </strong>{{crossReference.exclusionType}}
			<br />
			<strong>Active Date: </strong>{{crossReference.activateDate}}
			<br />
			<strong>Termination Date: </strong>{{crossReference.terminationDate}}
		</div>
  `
})
export class ExclusionCrossReference implements OnInit {
  
  @Input() crossReference: any;

  constructor( ) {}

  ngOnInit(){
  }

}
