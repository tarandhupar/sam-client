import { Component } from '@angular/core';
import { FeedbackFormService } from "../feedback-form/feedback-form.service";

@Component({
  selector: 'sam-feedback-button',
  templateUrl: 'sam-feedback-button.template.html'
})
export class SamFeedbackButtonComponent {
  feedback: any;
  constructor(
    private formService: FeedbackFormService)
  {}

  ngOnInit() {
    this.feedback = this.formService.componentInstance;
  }
}
