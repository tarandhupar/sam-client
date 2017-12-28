import { Directive, ElementRef, HostBinding, HostListener, Renderer2, EventEmitter, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[sam-drag-drop]',
})
export class DragDropDirective{

  @Output() private filesChangeEmiter : EventEmitter<File> = new EventEmitter();

  constructor(private _elementRef: ElementRef){}

  @HostListener('window:drop', ['$event']) public onDrop(evt){
    evt.preventDefault();
    evt.stopPropagation();

    const clickedInside = this._elementRef.nativeElement.contains(evt.target);
    if(clickedInside) {

      // Allow only video to be dragged into the element
      // If it is dragged and dropped inside the element, then emit the file name
      let files = evt.dataTransfer.files;
      if (files.length > 0 && files[0].type.startsWith('video')) {
        this.filesChangeEmiter.emit(files[0]);
      }
    }

  }

  @HostListener('window:dragover', ['$event']) public onDragOver(evt) {
    
      // Prevent default to load the file on the page
      evt.preventDefault();
      evt.stopPropagation();
      const clickedInside = this._elementRef.nativeElement.contains(evt.target);
      evt.dataTransfer.dropEffect = clickedInside? 'copy':'none';
  }

}
