import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component ({
  selector: 'sam-create-page-template',
  template: `
<div>
    <sam-breadcrumbs [crumbs]="crumbs"></sam-breadcrumbs>
    <h1 class="sam-ui header">
        <div class="sup header">{{sectionTitle}}</div>
        {{pageTitle}}
    </h1>
    <ng-content select="[form-view]"></ng-content>
    <button class="usa-button-outline" (click)="formAction('cancel')">Cancel</button>
    <button (click)="formAction('submit')">Submit</button>
</div>`
})
export class SamCreatePageTemplateComponent {
    @Input() crumbs;
    @Input() sectionTitle: string;
    @Input() pageTitle: string;
    @Output() action = new EventEmitter();

    formAction(evtStr){
        this.action.emit({event:evtStr});
    }
}
