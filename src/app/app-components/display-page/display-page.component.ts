import { Component, Directive, Input, ElementRef, Renderer, Output, OnInit, EventEmitter, ViewChild } from '@angular/core';

/**
* DisplayPageComponent - template component for generating display page
*
* @Input sidenavConfig: any - configuration for generating a sidenav
* @Input logoSrc: string - source path for adding a logo image on the sidenav
* @Input sidebarToggle: boolean - toggles the sidenav in the layout, defaults to true
*/
@Component({
	selector: 'display-page',
	templateUrl:'display-page.template.html'
})
export class DisplayPageComponent implements OnInit {
  @Input() sidenavConfig: any;
  @Input() logoSrc: string;
  @Input() sidebarToggle = true;
  contentClass = "usa-width-three-fourths";
	showCustomSidebar = true;
	showGeneratedSidebar = false;

  constructor(){}

  ngOnInit(){
  	if(!this.sidebarToggle){
  		this.contentClass = "usa-width-one-whole";
			this.showCustomSidebar = false;
			this.showGeneratedSidebar = false;
  	} else if (this.sidenavConfig){
			this.showCustomSidebar = false;
			this.showGeneratedSidebar = true;
		}
  }
}
