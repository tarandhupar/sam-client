import { Component, Input, HostListener, Output, EventEmitter, ElementRef } from '@angular/core';

@Component({
  selector: 'workspace-data-entry',
  templateUrl: 'data-entry.template.html'
})
export class DataEntryComponent {

  @Input() toggleControl:any;
  
  actions: Array<any> = [
    { 
      name: 'help', 
      label: 'Help', 
      icon: 'fa fa-question-circle', 
      callback: () => { console.log("Help!"); } 
    }
  ];

}
