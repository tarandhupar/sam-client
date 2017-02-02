import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sam-header-menu',
  templateUrl: 'header-menu.component.html'
})
export class SamHeaderMenuComponent {
  @Input() items: any = [];

  @Output() openChange = new EventEmitter();
  @Output() onOpen:EventEmitter<any> = new EventEmitter<any>();
  @Output() onClose:EventEmitter<any> = new EventEmitter<any>();
  @Output() onSelect:EventEmitter<any> = new EventEmitter<any>();

  private states = {
    open: false
  };

  @Input()
  set open(open) {
    this.states.open = open;
    this.openChange.emit(this.states.open);

    this.states.open ? this.onOpen.emit() : this.onClose.emit();
  }

  toggle($event) {
console.log($event);
    switch($event) {

    }
  }

  dispatch($event) {
    this.onSelect.emit($event);
  }
}
