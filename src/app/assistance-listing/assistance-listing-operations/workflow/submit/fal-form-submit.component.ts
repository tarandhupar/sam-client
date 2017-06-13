import {Component, Input} from "@angular/core";
import {FALFormViewModel} from "../../fal-form.model";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'fal-form-submit',
  templateUrl: 'fal-form-submit.template.html'
})

export class FALSubmitComponent {
  @Input() viewModel: FALFormViewModel;


  public submissionAlertConfig = {
    id: 'submission-instructions',
    type: 'warning',
    title: 'Submission Instructions',
    description: 'Please enter in a submission comment and click the "Submit to OMB" button to send your submission for OMB Review/Publication.'
  };

  public reason: FormControl;

  constructor() { }

  ngOnInit() {
    this.reason = new FormControl();
    this.reason.valueChanges.subscribe(data => this.updateViewModel(data));
  }
  updateViewModel(data) {
    this.viewModel.reason = data || null;
  }
}
