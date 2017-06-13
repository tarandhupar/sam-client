import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Router,NavigationExtras } from '@angular/router';

@Component ({
  selector: 'sam-editor',
  template: `
<div class="sam-editor-wrapper">
    <sam-label-wrapper [label]="label" [hint]="hint">
        <a *ngIf="routerLink" (click)="routerLinkAction()" class="usa-additional_text" label-right><i class="fa fa-pencil"></i> Edit</a>
        <a *ngIf="!showInputView && !routerLink" (click)="showInputView=true" class="usa-additional_text" label-right><i class="fa fa-pencil"></i> Edit</a> 
        <div *ngIf="!showInputView"> 
            <ng-content select="[editor-display-view]"></ng-content>
        </div>
        <div *ngIf="showInputView">
            <ng-content select="[editor-input-view]"></ng-content>
            <button class="usa-button-outline" (click)="formAction('formActionCancel')">Cancel</button>
            <button (click)="formAction('formActionSave')">Save</button>
        </div>
    </sam-label-wrapper>
</div>`
})
export class SamEditorComponent {
    @Input() showInputView;//set true/false to toggle between transcluded views
    @Input() label: string;
    @Input() hint: string;
    @Input() routerLink: String[];
    @Input() navigationExtras: NavigationExtras;
    @Output() action = new EventEmitter();

    private toggleable = false;

    constructor(private router: Router){}

    formAction(evtStr){
        this.showInputView = false;
        this.action.emit({event:evtStr});
    }

    ngOnChanges(){
        if(this.showInputView === null){
            this.toggleable = false;
        }
    }

    routerLinkAction(){
        this.router.navigate(this.routerLink, this.navigationExtras);
    }
}
