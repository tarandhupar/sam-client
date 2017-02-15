import { Directive, ElementRef, Input, DoCheck } from '@angular/core';

/**
 * Sam No Label Margin Directive
 * Removes top margin from input labels. This should only be used for form
 * controls and components where it is difficult to remove styling with generic
 * CSS. This directive will remove all margins for any labels that are
 * descendants of the parent element up which it is applied.
 */
@Directive({
  selector: '[reset-label-margin]'
})
export class ResetLabelMarginDirective implements DoCheck {
  @Input('reset-label-margin') public marginSize: string;
  private _parent: HTMLElement;

  constructor(private _element: ElementRef) {
    this._parent = this._element.nativeElement;
  }

  ngDoCheck() {
    const labels = this._parent.getElementsByTagName('label');
    for (let i = 0; i < labels.length; i++) {
      labels.item(i).style.marginTop = this.marginSize || '0px';
    }
  }
}
