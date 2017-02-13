import { Component, EventEmitter, Input, Output,  OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'sam-kba-entry',
	templateUrl: './kba.component.html'
})
export class SamKBAComponent implements OnChanges {
  @Input('label') label: string = '';

  @Input('questions') questions: any[] = [];
  @Input('question') question: FormControl;
  @Input('answer') answer: FormControl;

  @Input('labelKey') questionKey: string = 'question';
  @Input('valueKey') answerKey: string = 'id';

  @Output('onQuestionChange') onQuestionChange = new EventEmitter();

  protected states = {
    type: 'text',
    uid: Math.floor(Math.random() * 89999 + 10000),
    submitted: false,
    count: 0,
    errors: {
      question: '',
      answer: ''
    }
  };

  private $questions = [];
  private $question = '';

  ngOnInit() {
    this.$question = this.question.value;
    this.initQuestions();

    // Process answers
    if(this.answer.value.length) {
      let tmpAnswer = this.answer.value;

      this.states.count = tmpAnswer.length;

      this.states.type = 'password';
      tmpAnswer = tmpAnswer.replace(/&bull;/g, ' ');

      this.answer.setValue(tmpAnswer);
    }
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

  changeQuestion($value) {
    this.question.setValue($value);
    this.answer.setValue('');

    this.onQuestionChange.emit($value);
    this.updateState(null);
  }

  resetState() {
    let prop;
    for(prop in this.states.errors) {
      this.states.errors[prop] = '';
    }
  }

  updateState(submitted?) {
    let errors;

    submitted = submitted || false;

    if(submitted) {
      this.setSubmitted();
    }

    this.resetState();

    if(this.states.submitted && this.question.invalid) {
      this.states.errors.question = 'You must select a security question';
    }

    if(this.answer.invalid && (this.answer.dirty || this.states.submitted)) {
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
    } else {
      this.updateState();
    }
  }

  unsecureAnswer($event) {
    let oldCount = this.states.count,
        newCount = $event.target.value.length;

    if(!newCount || (oldCount - newCount) > 1) {
      this.states.type = 'text';
    }

    this.states.count = oldCount;
  }

  selectAnswer($event) {
    $event.target.select();
  }
}
