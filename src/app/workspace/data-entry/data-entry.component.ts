import { Component, Input, HostListener, Output, EventEmitter, ElementRef } from '@angular/core';
import  { Router, NavigationExtras  } from "@angular/router";

@Component({
  selector: 'workspace-data-entry',
  templateUrl: 'data-entry.template.html'
})
export class DataEntryComponent {

  @Input() toggleControl:any;
  
  actions: Array<any> = [
    { 
      label: 'Help', 
      icon: 'fa fa-question-circle', 
      callback: () => { this.router.navigate(['/help/award'], { fragment: 'assistanceListings'});}
    }
  ];
  
  constructor(private router: Router) {}

}
