import { Component, Input, HostListener, Output, EventEmitter, ElementRef } from '@angular/core';

@Component({
  selector: 'workspace-widget',
  templateUrl: 'workspace-widget.template.html'
})
export class WorkspaceWidgetComponent {
  @Input() title:string = "";

  
}
