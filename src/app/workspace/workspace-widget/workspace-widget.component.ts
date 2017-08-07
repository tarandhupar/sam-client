import { Component, Input, HostListener, Output, EventEmitter, ElementRef } from '@angular/core';
import { isFunction } from 'lodash';

export interface Shortcut {
  text: string;
  routerLink?: any[]|string;
  onClick: () => void;
}

@Component({
  selector: 'workspace-widget',
  templateUrl: 'workspace-widget.template.html'
})
export class WorkspaceWidgetComponent {
  @Input() title: string = "";
  @Input() shortcut: Shortcut;
  @Input() isExpand: boolean = false;

  @Output() onToggleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit() {
    //TODO
  }

  onShortcutClick() {
    if(this.shortcut.onClick && isFunction(this.shortcut.onClick)) {
      this.shortcut.onClick();
    }
  }

  onToggleBtnClick() {
    this.isExpand = !this.isExpand;
    this.onToggleChange.emit(this.isExpand);
  }
}
