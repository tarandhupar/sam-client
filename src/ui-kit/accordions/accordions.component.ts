import {Component, Input} from '@angular/core';

/**
 * The <samAccordions> component can generate accordions component with provided data
 * It is designed with sam.gov standards
 * https://gsa.github.io/sam-web-design-standards/
 * @Input accordionsData: array - Contains all the data for each accordion [{title:"", content""},...]
 * @Input bordered: string - Control whether the accordion component has a border
 */
@Component({
  selector: 'samAccordions',
  template: `<div [ngClass]="accordionsClass">
              <ul class="usa-unstyled-list">
                <li *ngFor="let accordion of accordionsData; let i = index">
                  <button class="usa-button-unstyled" [attr.aria-expanded]="isExpanded(i)" [attr.aria-controls]="'accordions-'+i" (click)="setExpandIndex(i)">{{accordion.title}}</button>
                  <div [id]="'accordions-'+i" [attr.aria-hidden]="!isExpanded(i)" class="usa-accordion-content">{{accordion.content}}</div>
                </li>
              </ul>
            </div>`,
})
export class SamAccordionsComponent {

  @Input() accordionsData:any;
  @Input() bordered:boolean;

  accordionsClass:string;
  expandIndex = -1;

  constructor() {
  }

  ngOnInit() {
    this.accordionsClass = "usa-accordion";
    if (this.bordered) {
      this.accordionsClass = "usa-accordion-bordered";
    }
  }


  isExpanded(i):boolean {
    return this.expandIndex === i;
  }

  setExpandIndex(i) {
    if (this.expandIndex === i) {
      this.expandIndex = -1;
    } else {
      this.expandIndex = i;
    }
  }

}
