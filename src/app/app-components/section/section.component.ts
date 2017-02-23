import { Component, Input } from '@angular/core';

/**
* SectionComponent - section component with an h3 title
*/
@Component({
	selector: 'sam-section',
	templateUrl:'section.template.html'
})
export class SamSectionComponent {
  @Input() title: string;
  @Input() titleId: string;
  @Input() helpText: string;
}
