import { Component, Input, OnInit } from '@angular/core';

/**
* SamWellComponent - component for displaying a well with grey background
*/
@Component({
	selector: 'sam-well',
	templateUrl:'well.template.html'
})
export class SamWellComponent {
  /**
  * well title text string
  */
  @Input() public title: string;

  constructor(){ }

}
