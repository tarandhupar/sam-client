import { Component, Input } from '@angular/core';
import { FeedbackFormService } from '../feedback-form/feedback-form.service';
import { SamFeedbackComponent } from '../feedback-form/feedback-form.component'

@Component({
  selector: 'sam-feedback-button',
  templateUrl: 'sam-feedback-button.template.html'
})
export class SamFeedbackButtonComponent {
  @Input() disabled = false;
  public feedback: SamFeedbackComponent;

  constructor(private formService: FeedbackFormService) {}

  ngOnInit() {
    this.feedback = this.formService.componentInstance;
  }
}
