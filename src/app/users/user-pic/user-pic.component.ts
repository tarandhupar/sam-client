import { Component, Input, OnInit } from '@angular/core';

/**
 * SamWellComponent - component for displaying a well with grey background
 */
@Component({
  selector: 'user-pic',
  templateUrl:'user-pic.template.html'
})
export class UserPic {
  @Input() user: { name: string, email: string };

  constructor(){ }
}
