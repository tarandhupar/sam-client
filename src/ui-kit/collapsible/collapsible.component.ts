import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'sam-collapsible',
  templateUrl: 'collapsible.template.html'
})
export class SamCollapsibleComponent implements OnChanges {
  @Input() public label: string;
  @Input() public startOpened: boolean;

  private _isOpened: boolean = false;

  constructor() {}

  ngOnChanges(): void {
    this._isOpened = this.startOpened || false;
  }

  isFilterOpen(): boolean {
    return this._isOpened;
  }

  toggleFilter(): boolean {
    return this._isOpened = !this._isOpened;
  }

  toggleButtonLabel(): string {
    return this.isFilterOpen() ? 'collapse' : 'expand';
  }
}
