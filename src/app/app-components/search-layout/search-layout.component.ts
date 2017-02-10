import { Component, Directive, Input, ElementRef, Renderer, Output, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { Router,NavigationExtras,NavigationEnd } from '@angular/router';
/**
* SearchLayoutComponent - template component for generating a search page
*/
@Component({
	selector: 'search-layout',
	templateUrl:'search-layout.template.html'
})
export class SearchLayoutComponent implements OnInit {
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
  ngOnInit(){}
}
