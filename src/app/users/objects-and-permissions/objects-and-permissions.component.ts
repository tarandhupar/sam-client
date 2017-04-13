import { Component, Input } from '@angular/core';


@Component({
  selector: 'objects-and-permissions',
  templateUrl: 'objects-and-permissions.html'
})
export class ObjectsAndPermissionsComponent {
  @Input() objects = [];

  constructor() { }

}
