import { Component, Directive, Input, ElementRef, Renderer, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router, NavigationExtras, NavigationEnd } from '@angular/router';
import { SortConfig } from '../interfaces';
/**
 * SearchLayoutComponent - template component for generating a search page
 */
@Component({
  selector: 'search-layout',
  templateUrl: 'search-layout.template.html'
})
export class SearchLayoutComponent {
  @Input() totalPages: number;
  @Input() currentPage: number;
  @Input() totalElements: number;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
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
  private _displayFilters: boolean = false;

  pageChangeHandler(event): void {
    this.pageChange.emit(event);
  }

  setMainWidth(): string {
    return this._displayFilters ? 'usa-width-three-fourths' : 'usa-width-one-whole';
  }

  setAsideWidth(): string {
    return this._displayFilters ? 'usa-width-one-fourth' : 'hide';
  }

  setOffset(): string {
    return this._displayFilters ? 'usa-offset-one-fourth' : '';
  }

  toggleFilters(event: Event): void {
    this._displayFilters = !this._displayFilters;
    return;
  }

  toggleFilterLabel(): string {
    return this._displayFilters ? 'fa fa-minus' : 'fa fa-plus';
  }
}
