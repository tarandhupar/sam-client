import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { IAMService } from 'api-kit';
import { Validators as $Validators } from '../shared/validators';

@Component({
  templateUrl: './details.component.html',
  providers: [IAMService]
})
export class DetailsComponent {
  public details: FormGroup;

  private lookups = {
    questions: [
      { 'id': 1,  'question': 'What was the make and model of your first car?' },
      { 'id': 2,  'question': 'Who is your favorite Actor/Actress?' },
      { 'id': 3,  'question': 'What was your high school mascot?' },
      { 'id': 4,  'question': 'When you were young, what did you want to be when you grew up?' },
      { 'id': 5,  'question': 'Where were you when you first heard about 9/11?' },
      { 'id': 6,  'question': 'Where did you spend New Years Eve 2000?' },
      { 'id': 7,  'question': 'Who was your childhood hero?' },
      { 'id': 8,  'question': 'What is your favorite vacation spot?' },
      { 'id': 9,  'question': 'What is the last name of your first grade teacher?' },
      { 'id': 10, 'question': 'What is your dream job?' },
      { 'id': 11, 'question': 'If you won the Lotto, what is the first thing you would do?' },
      { 'id': 12, 'question': 'What is the title of your favorite book?' }
    ]
  };

  private states = {
    editable: {
      identity: false,
      business: false,
      kba: false
    }
  };

  private user = {
    email: 'doe.john@gsa.gov',
    suffix: '',
    firstName: 'John',
    initials: 'J',
    lastName: 'Doe',

    workPhone: '2401234568',

    kbaAnswerList: [
      { questionId: 0, answer: '&bull;' },
      { questionId: 4, answer: '&bull;' },
      { questionId: 7, answer: '&bull;' }
    ]
  };

  ngOnInit() {
    let intAnswer;

    for(intAnswer = 0; intAnswer < this.user.kbaAnswerList.length; intAnswer++) {
      this.user.kbaAnswerList[intAnswer].answer = this.repeater(this.user.kbaAnswerList[intAnswer].answer, 8);
    }
  }

  repeater(string, iterations) {
    let repeater = '';

    if(string.length && iterations) {
      while(iterations--) {
        repeater += string;
      }
    }

    return repeater;
  }

  get phone():String {
    return this.user.workPhone
      .replace(/[^0-9]/g, '')
      .replace(/([0-9]{3})([0-9]{3})([0-9]{4})/g, '($1) $2-$3');
  }

  get name():String {
    return [
      this.user.firstName || '',
      this.user.initials || '',
      this.user.lastName || ''
    ].join(' ').replace(/\s+/g, ' ');
  }

  onEdit(groupKey) {
    this.states.editable[groupKey] = true;
  }

  isEdit(groupKey) {
    return this.states.editable[groupKey] || false;
  }
};
