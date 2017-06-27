import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component ({
  selector: 'sam-complex-form-template',
  template: `
<br/>
<div class="complex-form-wrapper">
  <div class="usa-grid">
    <sam-breadcrumbs [crumbs]="crumbs"></sam-breadcrumbs>
  </div>
  <div class="usa-grid sticky-target">
    <aside class="usa-width-one-fourth">
      <div sam-sticky limit=1200 container="sticky-target">
        <img *ngIf="sideNavImage" class="complex-template-sidenav-img" src="{{sideNavImage}}" alt="{{sideNavImageAlt}}"/>
      
        <sam-sidenav (data)="navHandler($event)" [selection]="sideNavSelection" [model]="sideNavModel"></sam-sidenav>
      </div>
      &nbsp;
    </aside>

    <div class="usa-width-three-fourths">
      <div class="usa-width-one-whole">
        <sam-status-banner type="error" *ngIf="statusBannerLeadingText">
          <div leading-content>{{statusBannerLeadingText}}</div>
          <div main-content>
            <ng-content select="[status-banner]"></ng-content>
          </div>
        </sam-status-banner>
        <h1 class="sam-ui header">
          <div class="sup header">{{pageTitle}}</div>
          {{sectionTitle}}
        </h1>
        <ng-content select="[form-sections]"></ng-content>    
        <div>
          <div class="pull-left">
            <sam-button buttonType="outline" buttonText="Cancel" (onClick)="formAction('cancel')"></sam-button>
            <sam-button buttonType="outline" buttonText="Save and Exit" (onClick)="formAction('save-exit')"></sam-button>
            <sam-button buttonType="outline" *ngIf="sectionIndex - 1 >= 0" buttonText="Previous" (onClick)="formAction('back')"></sam-button>
            <sam-button buttonType="outline" *ngIf="sectionIndex + 1 < numberOfSections" buttonText="Save and Continue" (onClick)="formAction('next')"></sam-button>
            <sam-button *ngIf="sectionIndex + 1 == numberOfSections" buttonText="Done" (onClick)="formAction('done')"></sam-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`
})
export class SamComplexFormTemplateComponent {
    @Input() crumbs;
    @Input() sideNavModel;
    @Input() sideNavSelection;
    @Input() sideNavImage;
    @Input() sideNavImageAlt;
    @Input() sectionIndex: number;
    @Input() numberOfSections: number;
    @Input() sectionTitle: string;
    @Input() pageTitle: string;
    @Input() statusBannerLeadingText: string;
    @Output() action = new EventEmitter();
    @Output() sideNavOutput = new EventEmitter();

    formAction(evtStr){
        this.action.emit({event:evtStr});
    }

    navHandler(evt){
        this.sideNavOutput.emit(evt);
    }
}
