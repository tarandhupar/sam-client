import { Component, Input, Output, EventEmitter} from '@angular/core';

/**
 * The <samPagination> allows users to select a page
 * https://gsa.github.io/sam-web-design-standards/
 * @Input currentPage:number - shows the current page number
 * @Input totalPage:number - shows the number of total pages
 * @Output pageChange: trigger when current page is changed
 *
 */
@Component({
  selector: 'samPagination',
  template: `<nav class="usa-pagination" aria-label="pagination">
              <ul>
                <li *ngIf="showPrevious()"><a class="page-previous" aria-label="previous" (click)="onPreviousClick()">&lsaquo; Prev</a></li>
                <li><a class="page-button" [ngClass]="textDecoration(1)" (click)="onPageClick(1)" [attr.aria-label]="getAriaLabel(1)">1</a></li>
                <li *ngIf="showFirstEllipsis()"><span class="first-ellipsis">&hellip;</span></li>
                <li *ngFor="let i of consecutivePageRange()"><a class="page-button" [ngClass]="textDecoration(i)" (click)="onPageClick(i)" [attr.aria-label]="getAriaLabel(i)">{{i}}</a></li>
                <li *ngIf="showLastEllipsis()"><span class="last-ellipsis">&hellip;</span></li>
                <li *ngIf="showLastButton()"><a class="page-button" [ngClass]="textDecoration(totalPages)" (click)="onPageClick(totalPages)" [attr.aria-label]="getAriaLabel(totalPages)">{{totalPages}}</a></li>
                <li *ngIf="showNext()"><a class="page-next" aria-label="next" (click)="onNextClick()">Next &rsaquo;</a></li>
              </ul>
             </nav>    
  `,
  styleUrls: [ 'pagination.style.css' ],
})
export class SamPaginationComponent {

  private MaxPagesBeforeOrAfterCurrent: number = 3;
  private threshold: number = 6; // The threshold to check whether ellipsis is needed

  @Input() currentPage: number;
  @Input() totalPages: number;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit(){ }

  consecutivePageRange() {

    var start = 2;
    var end = this.totalPages - 1;
    // If total number of pages less than or equal to 10, then display all page links
    // Otherwise, use the algorithm to calculate the start and end page to show between the first and last page
    if(end > 9){
      // If the current page is less than the threshold, then display first 8 page links followed by ellipsis and the last page link
      if(this.currentPage < this.threshold){
        end = 8;
      }
      // If the current page is greater than the total page minus threshold, then display the first page link followed by ellipsis and the last 8 page links
      else if(this.currentPage > this.totalPages - this.threshold){
        start = end - 6;
      }
      // For all other conditions, display the first page link followed by ellipsis and three links before and after the current page followed by ellipsis and the last page link
      else{
        start = this.currentPage - this.MaxPagesBeforeOrAfterCurrent;
        end = this.currentPage + this.MaxPagesBeforeOrAfterCurrent;
      }
    }

    let ret = [];
    for (let i = start; i <= end; i++) {
      ret.push(i);
    }
    return ret;

  }

  onPageClick(pageNumber: number) {
    this.currentPage = pageNumber;
    this.pageChange.emit(this.currentPage);
    window.scrollTo(0,0);
  }

  onNextClick() {
    this.onPageClick(this.currentPage + 1);
  }

  onPreviousClick() {
    this.onPageClick(this.currentPage - 1);
  }

  showPrevious() {
    return this.currentPage > 1;
  }

  showNext() {
    return this.currentPage < this.totalPages;
  }

  showLastButton() {
    return this.totalPages > 1;
  }

  showLastEllipsis() {
    return this.totalPages > 10 && this.currentPage <= this.totalPages - this.threshold;
  }

  showFirstEllipsis() {
    return this.totalPages > 10 && this.currentPage >= this.threshold;

  }

  textDecoration(i) {
    return this.currentPage === i ? 'usa-current' : '';
  }

  getAriaLabel(i){
    return this.currentPage === i ? 'current' : '';
  }

}
