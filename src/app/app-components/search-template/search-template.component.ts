import { Component, Directive, Input, ElementRef, Renderer, Output, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { Router,NavigationExtras,NavigationEnd } from '@angular/router';
/**
* SearchTemplateComponent - template component for generating a search page
*
* @Input sidenavConfig: any - configuration for generating a sidenav
* @Input sidebarToggle: boolean - toggles the sidenav in the layout, defaults to true
*/
@Component({
	selector: 'search-template',
	templateUrl:'search-template.template.html'
})
export class SearchTemplateComponent implements OnInit {
  @Input() sidenavConfig: any;
  @Input() sidebarToggle = true;
  contentClass = "usa-width-three-fourths";
	showCustomSidebar = true;
	showGeneratedSidebar = false;

  constructor(private router: Router){
		//needed for fragment navigations
		router.events.subscribe(s => {
			if (s instanceof NavigationEnd) {
				const tree = router.parseUrl(router.url);
				if (tree.fragment) {
					const element = document.getElementById(tree.fragment);
					if (element) { element.scrollIntoView(); }
				}
			}
		});
	}

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
	
	sidenavPathEvtHandler(data){
		if(data.charAt(0)=="#"){
			//this.router.navigate([], { fragment: data });
			this.router.navigate([], { fragment: data.substring(1) });
			//window.location.hash = data.substring(1);
		} else {
			this.router.navigate([data] );
		}
	}
}
