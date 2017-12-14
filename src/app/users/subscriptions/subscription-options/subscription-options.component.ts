import { Component,
         Input,
         Output,
         EventEmitter,
         ViewChild,
         ElementRef
        } from '@angular/core';


@Component({
  selector: 'sam-subscription-actions',
  templateUrl: 'subscription-actions.template.html'
})
export class SubscriptionActionsComponent {
  /**
   * Takes an array of actions for the dropdown
   */
  @Input() public actions: Array<any> = [];
  /**
   * Disable actions
   */
  @Input() public disabled: boolean = false;
  @Input() public buttonType: 'primary'|'default' = 'default';
  /**
   * Emits event when action changes
   */
  @Output() public emitAction: EventEmitter<any> = new EventEmitter<any>();

  private showActions = false;

  private  selectedAction = "";

  hideActions() {
    return this.showActions = false;
  }

  toggleActions() {
    return this.showActions = !this.showActions;
  }

  chooseAction() {
    //this.toggleActions();
    this.emitAction.emit(this.selectedAction);
    setTimeout(() => this.selectedAction="", 0);
    return;
  }
}
