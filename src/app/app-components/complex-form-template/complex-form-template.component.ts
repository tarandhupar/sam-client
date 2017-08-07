import {Component, Input, Output, EventEmitter, ViewChild} from "@angular/core";

@Component ({
  selector: 'sam-complex-form-template',
  template: `
<br/>
<div class="complex-form-wrapper">
  <div class="usa-grid">
    <sam-breadcrumbs [crumbs]="crumbs" (crumbActionHandler)="breadcrumbHandler($event)"></sam-breadcrumbs>
  </div>
  <div class="usa-grid sticky-target">
    <aside class="usa-width-one-fourth">
      <div sam-sticky limit=1200 container="sticky-target">
        <img *ngIf="sideNavImage" class="complex-template-sidenav-img" src="{{sideNavImage}}" alt="{{sideNavImageAlt}}"/>
      
        <sam-sidenav (data)="navHandler($event)" [labelLookup]="sideNavSelection" [model]="sideNavModel"></sam-sidenav>
      </div>
      &nbsp;
    </aside>

    <div class="usa-width-three-fourths">
      <div class="usa-width-one-whole">
        <sam-status-banner [type]="statusBannerType" *ngIf="statusBannerLeadingText">
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
            <sam-button [buttonId]="'fal-form-nav-cancel'" buttonType="outline" buttonText="Cancel" (onClick)="formAction('cancel')"></sam-button>
            <sam-button [buttonId]="'fal-form-nav-back'" buttonType="outline" *ngIf="sectionIndex - 1 >= 0" buttonText="Back" (onClick)="formAction('back')"></sam-button>
            <sam-button [buttonId]="'fal-form-nav-next'"buttonType="outline" *ngIf="sectionIndex + 1 < numberOfSections" buttonText="Next" (onClick)="formAction('next')"></sam-button>
            <sam-button [buttonId]="'fal-form-nav-done'" buttonText="Done" (onClick)="formAction('done')"></sam-button>
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
    @Input() statusBannerType:string = "error";
    @Input() statusBannerLeadingText: string;
    @Output() action = new EventEmitter();
    @Output() sideNavOutput = new EventEmitter();
    @Output() public breadcrumbOut = new EventEmitter();
    breadcrumbHandler(evt){
      this.breadcrumbOut.emit(evt);
    }
    formAction(evtStr){
        this.action.emit({event:evtStr});
    }

    navHandler(evt){
        this.sideNavOutput.emit(evt);
    }
}
