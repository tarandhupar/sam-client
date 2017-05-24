import { Component, Input, HostListener, Output, EventEmitter, ElementRef } from '@angular/core';

@Component({
  selector: 'workspace-widget',
  templateUrl: 'workspace-widget.template.html'
})
export class WorkspaceWidgetComponent {
  @Input() title:string = "";
  @Input() isExpand:boolean = false;

  @Output() onToggleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit(){}

  onToggleBtnClick(){
    this.isExpand = !this.isExpand;
    this.onToggleChange.emit(this.isExpand);
  }

}
