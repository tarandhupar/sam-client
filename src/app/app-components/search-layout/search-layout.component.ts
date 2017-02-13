import { Component, Directive, Input, ElementRef, Renderer, Output, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { Router, NavigationExtras, NavigationEnd } from '@angular/router';
/**
 * SearchLayoutComponent - template component for generating a search page
 */
@Component({
  selector: 'search-layout',
  templateUrl: 'search-layout.template.html'
})
export class SearchLayoutComponent implements OnInit {
  @Input() totalPages: number;
  @Input() currentPage: number;
  @Input() totalElements: number;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  public contentClass: string = 'usa-width-three-fourths';
  public showCustomSidebar: boolean = true;
  public showGeneratedSidebar: boolean = false;
  public displayNumber: number = 10;
  public sortConfig: SortConfig = {
    options: [
      {value: '', label: 'Relevant', name: 'relevant'},
      {value: 'latest', label: 'Latest', name: 'latest'},
      {value: 'oldest', label: 'Oldest', name: 'oldest'}
    ],
    disabled: false,
    label: 'Sort',
    name: 'sort'
  };
  public sortModel: string = '';

  constructor(private router: Router) {
		// needed for fragment navigations
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
  pageChangeHandler(event): void {
    this.pageChange.emit(event);
  }
  ngOnInit() { }
}

export interface SortConfig {
  options: Array<SortOption>;
  disabled: boolean;
  label: string;
  name: string;
}

export interface SortOption {
  value: string;
  label: string;
  name: string;
}

