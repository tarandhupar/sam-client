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
  /**
  * Title text displayed at the top
  */
  @Input() public titleText: string;
  /**
  * Total number of pages, value passed to generate list results message and pagination
  */
  @Input() public totalPages: number;
  /**
  * Current page number, value passed to generate list results message and pagination
  */
  @Input() public currentPage: number;
  /**
  * Total number of results, value passed to generate list results message and pagination
  */
  @Input() public totalElements: number;
  /**
  * Flag to hide content until list is fully loaded
  */
  @Input() public loadFlag: any = true; 
  /**
  * Suffix string for list results message
  */
  @Input() public listMessageSuffix: string;
  /**
  * Add button text string
  */
  @Input() public addBtnText: string;
  /**
  * Event emitter when user navigates to a different page
  */
  @Output() public pageChange: EventEmitter<number> = new EventEmitter<number>();
  /**
  * Event emitter when user navigates to a different page
  */
  @Output() public addBtnClick: EventEmitter<any> = new EventEmitter<any>();
  
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
    document.getElementById('workspace-target').focus();
    this.pageChange.emit(event);
  }
  
  addBtnClickHandler(event): void {
    this.addBtnClick.emit(event);
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

