import { Component, Input } from '@angular/core';

/**
* SamSubSectionComponent - section component with an h3 title
*/
@Component({
	selector: 'sam-subsection',
	templateUrl:'subsection.template.html'
})
export class SamSubSectionComponent{
  @Input() title: string;
  @Input() titleId: string;
  @Input() helpText: string;
}
