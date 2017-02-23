import { Component, Input } from '@angular/core';

/**
* SamTitleSectionComponent - section component with an h1 title
*/
@Component({
	selector: 'sam-title-section',
	templateUrl:'title-section.template.html'
})
export class SamTitleSectionComponent{
  @Input() title: string;
  @Input() titleId: string;
}
