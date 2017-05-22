// import {Directive, EventEmitter, HostListener, ElementRef} from '@angular/core';
// import {Observable} from 'rxjs/Observable';
//
// @Directive({selector: '[sam-draggable]'})
// export class DraggableDirective {
//   mousedrag: Observable;
//   mouseup   = new EventEmitter<void>();
//   mousedown = new EventEmitter<MouseEvent>();
//   mousemove = new EventEmitter<MouseEvent>();
//
//   @HostListener('mouseup', ['$event'])
//   onMouseup(event) { this.mouseup.next(event); }
//
//   @HostListener('mousedown', ['$event'])
//   onMousedown(event) { this.mousedown.next(event); }
//
//   @HostListener('mousemove', ['$event'])
//   onMousemove(event) { this.mousemove.next(event); }
//
//   constructor(public element: ElementRef) {
//     this.element.nativeElement.style.position = 'relative';
//     this.element.nativeElement.style.cursor = 'pointer';
//
//     this.mousedrag = this.mousedown.map(event => {
//         event.preventDefault();
//         return {
//           left: event.clientX - this.element.nativeElement.getBoundingClientRect().left,
//           top:  event.clientY - this.element.nativeElement.getBoundingClientRect().top
//         };
//       })
//       .flatMap(imageOffset => this.mousemove.map(pos => ({
//           top:  pos.clientY - imageOffset.top,
//           left: pos.clientX - imageOffset.left
//         }))
//         .takeUntil(this.mouseup));
//
//   }
//
//
//   onInit() {
//     this.mousedrag.subscribe({
//       next: pos => {
//         // Update position
//         this.element.nativeElement.style.top  = pos.top  + 'px';
//         this.element.nativeElement.style.left = pos.left + 'px';
//       }
//     });
//   }
//
// }
