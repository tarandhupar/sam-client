import { Component, OnInit } from '@angular/core';
import { FeedbackFormService } from 'app/app-components/feedback-form/feedback-form.service';

@Component({
  providers: [ ],
  templateUrl: './overview.template.html',
})
export class OverviewComponent{
  feedback: any;

  constructor(
    private formService: FeedbackFormService
  ) { }

  ngOnInit() {
    this.feedback = this.formService.componentInstance;
  }
}
