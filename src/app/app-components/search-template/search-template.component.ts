import { Component, Directive, Input, ElementRef, Renderer, Output, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { Router,NavigationExtras,NavigationEnd } from '@angular/router';
/**
* SearchTemplateComponent - template component for generating a search page
*/
@Component({
	selector: 'search-template',
	templateUrl:'search-template.template.html'
})
export class SearchTemplateComponent implements OnInit {
  @Input() totalPages: number;
	@Input() currentPage: number;
  @Input() totalElements: number;
	@Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  contentClass = "usa-width-three-fourths";
	showCustomSidebar = true;
	showGeneratedSidebar = false;
	displayNumber = 10;
	sortConfig = {
    options: [
      {value:'', label: 'Relevant', name: 'relevant'},
      {value: 'latest', label: 'Latest', name: 'latest'},
      {value: 'oldest', label: 'Oldest', name: 'oldest'}
    ],
    disabled: false,
    label: 'Sort',
    name: 'sort'
  };
	sortModel = "";

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
	pageChangeHandler(event){
		this.pageChange.emit(event);
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
