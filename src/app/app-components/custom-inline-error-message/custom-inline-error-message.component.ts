import {Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';

@Component({
  selector : 'inline-error-message',
  providers: [ ],
  templateUrl: 'custom-inline-error-message.template.html',
})

export class CustomInlineErrorMessageComponent{
  @Input() message: string = '';
}
