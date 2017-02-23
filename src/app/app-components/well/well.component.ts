import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'sam-well',
	templateUrl:'well.template.html'
})
export class SamWellComponent {
  /**
  * well title text string
  */
  @Input() title: string;

  constructor(){ }

}
