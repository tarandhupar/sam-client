import { Component, Input } from '@angular/core';

/**
 * SamWellComponent - component for displaying a well with grey background
 */
@Component({
  selector: 'sam-solo-accordian',
  templateUrl:'solo-accordian.template.html'
})
export class SamSoloAccordian {
  @Input() titleText: string;
  @Input() isOpen: boolean = true;
}
