import { Component, Input, OnInit } from '@angular/core';

/**
* SectionComponent - template component for generating display page
*
* @Input sidenavConfig: any - configuration for generating a sidenav
* @Input logoSrc: string - source path for adding a logo image on the sidenav
* @Input sidebarToggle: boolean - toggles the sidenav in the layout, defaults to true
*/
@Component({
	selector: 'sam-section',
	templateUrl:'section.template.html'
})
export class SectionComponent implements OnInit {
  @Input() title: string;
  @Input() helpText: string;
  @Input() headTag = "h3";

  constructor(){ }

  ngOnInit(){ }
}
