import { Component, Input } from '@angular/core';

/**
* SamSubSectionComponent - section component with an h3 title
*/
@Component({
	selector: 'sam-subsection',
	templateUrl:'subsection.template.html'
})
export class SamSubSectionComponent{
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
