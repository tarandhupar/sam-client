import { Directive, ElementRef, HostBinding, HostListener, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: 'input[type=file]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileValueAccessorDirective,
      multi: true
    }
  ]
})
export class FileValueAccessorDirective implements ControlValueAccessor {
  public onChange;

  @HostListener('change', ['$event.target.value']) _handleInput(event) {
    this.onChange(event);
  }

  constructor(private element: ElementRef, private render: Renderer2) {  }

  writeValue(value: any) {
    const normalizedValue = value == null ? '' : value;
    // Browser lacks security for access file storage (Needs file binary data - temporary workaround)
    this.render.setProperty(this.element.nativeElement, 'value', '');
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {  }
  nOnDestroy() {  }
}
