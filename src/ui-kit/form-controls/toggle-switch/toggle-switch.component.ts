import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'sam-toggle-switch',
  template: `
    <label class="sam-toggle-switch">
      <input class="switch-input" type="checkbox" (click)="onSwitchClick($event.target.checked)" [disabled]="disableSwitch">
      <div class="switch-label"></div>
    </label>

  `,
})
export class SamToggleSwitchComponent{

  @Input() disableSwitch: boolean = false;
  @Output() switchStatusChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(){}

  onSwitchClick(val){
    this.switchStatusChange.emit(val);
  }

}
