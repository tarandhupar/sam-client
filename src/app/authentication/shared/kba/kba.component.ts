import { Component, EventEmitter, Input, Output,  OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'sam-kba-entry',
	templateUrl: './kba.component.html'
})
export class KBAComponent implements OnChanges {
  @Input('label') label: string = '';

  @Input('questions') questions: any[] = [];
  @Input('question') question: FormControl;
  @Input('answer') answer: FormControl;

  @Input('labelKey') questionKey: string = 'question';
  @Input('valueKey') answerKey: string = 'id';

  @Output('onQuestionChange') onQuestionChange = new EventEmitter();

  protected states = {
    type: 'text',
    submitted: false,
    errors: {
      question: '',
      answer: ''
    }
  };

  private $questions = [];
  private $question;

  ngOnInit() {
    this.$question = this.question.value;
    this.initQuestions();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.initQuestions();
  }

  initQuestions() {
    const keys = {
      label: this.questionKey,
      value: this.answerKey
    };

    this.$questions = this.questions.map(function(question, intQuestion) {
      return {
        label: question[keys.label] || ('Question' + intQuestion + 1),
        value: question[keys.value] || intQuestion,
        disabled: question.disabled || false
      };
    });
  }

  setUnsubmitted() {
    this.states.submitted = false;
  }

  setSubmitted() {
    this.states.submitted = true;
  }

  changeQuestion(value) {
    this.question.setValue(value);
    this.onQuestionChange.emit(value);
    this.updateState(null);
  }

  resetState() {
    let prop;
    for(prop in this.states.errors) {
      this.states.errors[prop] = '';
    }
  }

  updateState(submitted) {
    let errors;

    submitted = submitted || false;

    if(submitted) {
      this.setSubmitted();
    }

    this.resetState();

    if(this.states.submitted && this.question.invalid) {
      this.states.errors.question = 'You must select a security question';
    }

    if(this.states.submitted && this.answer.invalid) {
      errors = this.answer.errors;

      if(errors['required'])
        this.states.errors.answer = 'Answer is required';
      if(errors['minlength'])
        this.states.errors.answer = 'Answers must be at least 8 characters';
      if(errors['unique'])
        this.states.errors.answer = 'Answers provided must be unique';
    }
  }

  secureAnswer($event) {
    if(this.answer.valid) {
      this.states.type = 'password';
    }
  }

  unsecureAnswer($event) {
    this.states.type = 'text';

    if(!this.answer.value.length) {
      this.states.type = 'text';
    }
  }

  selectAnswer($event) {
    $event.target.select();
  }
}
