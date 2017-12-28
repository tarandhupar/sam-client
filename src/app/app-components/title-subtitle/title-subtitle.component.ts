import { Component, Input } from '@angular/core';

@Component({
	selector: 'sam-title-subtitle',
	templateUrl:'title-subtitle.template.html'
})
export class SamTitleSubtitleComponent {
  @Input() public titleText: string;
  @Input() public subtitle: string;

  constructor(){ }

}
