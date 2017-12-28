import { Injectable } from "@angular/core";
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class FeedbackFormService implements CanDeactivate<CanComponentDeactivate>{
  componentInstance: any;
  discardFeedbackRes: boolean;
  formStarted: boolean;
  formSubmitted: boolean;

  canDeactivate(component: CanComponentDeactivate) {
    return this.componentInstance.canDeactivate ? this.componentInstance.canDeactivate() : true;
  }
}
