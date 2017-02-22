import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SortConfig } from '../interfaces';
/**
 * WorkspaceLayoutComponent - template component for generating a workspace page
 */
@Component({
  selector: 'workspace-layout',
  templateUrl: 'workspace-layout.template.html'
})
export class WorkspaceLayoutComponent {
  @Input() titleText: string;
  @Input() totalPages: number;
  @Input() currentPage: number;
  @Input() totalElements: number;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  public contentClass: string = 'usa-width-three-fourths';
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

