import { Component, Input } from '@angular/core';

/**
* SectionComponent - section component with an h3 title
*/
@Component({
	selector: 'sam-section',
	templateUrl:'section.template.html'
})
export class SamSectionComponent {
	/**
	* title text to be populated in header tag
	*/
  @Input() public title: string;
	/**
	* title id string to be populated in header's id attribute
	*/
  @Input() public titleId: string;
  @Input() public helpText: string;
}
