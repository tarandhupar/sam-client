import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

export interface Offset {
  top?:  number,
  left?: number
};
/**
 * The <samAlert> component is designed with sam.gov standards to show that this is an official website
 * https://gsa.github.io/sam-web-design-standards/
 *
 * @Input type: Set alert type, defaults to 'success'
 * @Input title: Set alert title
 * @Input description: Set alert description
 * @Input class: Sets additional classes
 * @Input showClose: Shows close button
 * @Input dismissTimer: Auto-dismiss timer (ms)
 * @Input target: Element to position alert against
 * @Input placement: Position against element '<vertical> <horizontal>' [top|right|bottom|center]
 * @Input offset: Any additional { top: 0, left: 0 } offsets after x, y has been applied
 *
 * @Output dismiss: dismiss event emitter
 */
@Component({
  selector: 'samAlert',
  templateUrl: './alert.template.html'
})
export class SamAlertComponent {
  @Input() type: string;
  @Input() title: string = '';
  @Input() class: string = '';
  @Input() description: string;
  @Input() showClose: boolean = false;
  @Input() dismissTimer = 0;
  @Input() target: any;
  @Input() placement: string = 'top';
  @Input() offset: Offset = {
    top: 0,
    left: 0
  };

  @Output() hiddenChange = new EventEmitter();
  @Output() dismiss: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('alert') alert;

  private states = {
    loaded: false,
    show: true
  };

  private types:any = {
    'success': 'usa-alert-success',
    'warning': 'usa-alert-warning',
    'error': 'usa-alert-error',
    'info': 'usa-alert-info'
  };

  private position: any = {};
  private selectedType: string = this.types['success'];

  ngOnInit() {
    if(!this.typeNotDefined()) {
      this.selectedType = this.types[this.type];
    }
  }

  ngAfterViewInit() {
    if(this.states.show && this.target !== undefined) {
      this.setPosition();
    }

    this.states.loaded = true;
  }

  @Input()
  get hidden() {
    return !this.states.show;
  }

  set hidden(isHidden) {
    const open = !isHidden;

    if(open && this.dismissTimer > 0) {
      this.open();

      setTimeout(() => {
        this.close();
      }, this.dismissTimer);
    } else {
      open ? this.open() : this.close();
    }
  }

  public open() {
    if(this.states.loaded && this.target !== undefined) {
      this.setPosition();
    }

    this.states.show = true;
    this.hiddenChange.emit(true);
  }

  private close() {
    this.states.show = false;
    this.hiddenChange.emit(false);
    this.dismiss.emit();
  }

  private typeNotDefined() {
    if(!this.type || this.type.length == 0) {
      return true;
    }

    if(!this.types[this.type]) {
      return true;
    }

    return false;
  }

  private setPosition() {
    let body = document.body,
        target = this.target,
        source = this.alert.nativeElement,
        type = target.constructor.name,
        placement = (this.placement || 'top').replace(/\s+/, ' '),
        offsets,
        dimensions,

        delta = {
          top: 0,
          left: 0
        },

        style = {
          position: 'relative',
          top: 0,
          left: 0
        };

    /**
     * Select DOM Target
     */
    switch(type) {
      case 'String':
        target = (target == 'body') ? document.body : document.querySelector(target);
        break;

      case 'ElementRef':
        target = target.nativeElement;
        break;

      default:
        if(type.search(/HTML/i) == - 1) {
          console.warn(`@Input target => Does not support object type: ${target.constructor.name}`);
          return style;
        }

        break;
    }

    /**
     * Return if Element is not defined
     */
    if(!target) {
      console.warn('@Input target was not found in the DOM or there was an issue with the object passed in');
      return;
    }

    /**
     * Get Elements' offset positions
     */
    offsets = {
      body: this.getPosition(body),
      target: this.getPosition(target),
      source: this.getPosition(source)
    };

    /**
     * Get Elements' natural width/height
     */
    dimensions = {
      body: this.getDimensions(body),
      target: this.getDimensions(target),
      source: this.getDimensions(source)
    };

    /**
     * Reset the alerts offset position to [0,0]
     */
    style.top = offsets.source.y;
    style.left = offsets.source.x;

    /**
     * Line up the top left corner positions of the alert to the target element
     */
    style.top += offsets.target.top;
    style.left += offsets.target.left;

    /**
     * Determine placement settings and process position adjustments
     */
    placement = placement.indexOf(' ') > -1 ? placement : `${placement} center`;

    if(placement.search(/(^top)|(top$)/) > -1)
      style.top -= dimensions.source.height;
    if(placement.search(/(^bottom)|(bottom$)/) > -1)
      style.top += dimensions.target.height;
    if(placement.search(/(^left)|(left$)/) > -1)
      style.left -= dimensions.source.width;
    if(placement.search(/(^right)|(right$)/) > -1)
      style.left += dimensions.target.width;
    if(placement.search(/^(top|bottom)\scenter$/) > -1)
      style.left += Math.abs(dimensions.source.width - dimensions.target.width) / 2;
    if(placement.search(/^(left|right)\scenter$/) > -1)
      style.top += Math.abs(dimensions.source.height - dimensions.target.height) / 2;

    // Apply @Input offsets
    style.top += this.offset.top || 0;
    style.left += this.offset.left || 0;

    // Adjust offsets if off viewport (Should happen if target is body)
    /*
    if(style.top < 0 || style.top > offsets.viewport.height)
      style.top = Math.min(offsets.viewport.height, Math.max(0, style.top)) + (style.top < 0 ? offsets.source.height : -offsets.source.height);
    if(style.left < 0 || style.left > offsets.viewport.width)
      style.left = Math.min(offsets.viewport.width, Math.max(0, style.left)) + (style.left < 0 ? offsets.source.width : -offsets.source.width);
    */

    this.position = this.toPx(style);
  }

  private getDimensions(element) {
    let computed = window.getComputedStyle(element),
        dimensions = {
          width: +parseFloat(computed.width).toFixed(1),
          height: +parseFloat(computed.height).toFixed(1)
        };

    return dimensions;
  }

  private getPosition(element) {
    let position = {
          top:  0,
          left: 0,
          x:    0,
          y:    0
        },

        bounds;

    while(element) {
      bounds = element.getBoundingClientRect();

      position.top = Math.max(position.top, bounds.top);
      position.left = Math.max(position.left, bounds.left);

      element = element.offsetParent;
    }

    position.x = position.left * -1;
    position.y = position.top * -1;

    return position;
  }

  private toPx(styles) {
    const px = (value) => `${value}px`;
    let style;

    for(style in styles) {
      if(typeof styles[style] == 'number') {
        styles[style] = px(styles[style]);
      }
    }

    return styles
  }
}
