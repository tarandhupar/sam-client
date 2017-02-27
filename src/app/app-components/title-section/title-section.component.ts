import { Component, Input } from '@angular/core';

/**
* SamTitleSectionComponent - section component with an h1 title
*/
@Component({
	selector: 'sam-title-section',
	templateUrl:'title-section.template.html'
})
export class SamTitleSectionComponent{
	/**
	* title text to be populated in header tag
	*/
  @Input() public title: string;
	/**
	* title id string to be populated in header's id attribute
	*/
  @Input() public titleId: string;
}
