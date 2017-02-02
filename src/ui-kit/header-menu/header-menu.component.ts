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

  private fnFocus = (event) => {
    this.openChange.emit(false);
  };

  @Input()
  set open(open) {

    this.states.open = open;
    this.openChange.emit(this.states.open);

    this.states.open ? this.onOpen.emit() : this.onClose.emit();
    this.states.open ?  this.bind() : this.unbind();
  }

  dispatch($event) {
    this.onSelect.emit($event);
  }

  bind() {
    const target = document.getElementById('main-container');
    target.addEventListener('click', this.fnFocus, false);
  }

  unbind() {
    const target = document.getElementById('main-container');
    target.removeEventListener('click', this.fnFocus, false);
  }
}
