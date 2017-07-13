import { isUndefined, merge } from 'lodash';
import * as Cookies from 'js-cookie';
import * as request from 'superagent';

import {
  config, utilities,
  getAuthHeaders, exceptionHandler, sanitizeRequest,
  isDebug, logger
} from './helpers';

export const kba = {
  questions($success, $error) {
    let endpoint = utilities.getUrl(config.kba.questions),
        auth = getAuthHeaders(),
        $kba = {
          questions: [],
          selected: []
        };

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    if(auth) {
      request
        .get(endpoint)
        .set(auth)
        .then((response) => {
          $kba.questions = (response.body.kbaQuestionList || []);
          $kba.selected = (response.body.kbaAnswerIdList || []).map((questionID) => {
            return parseInt(questionID, 10);
          });

          $success($kba);
        }, (response) => {
          $error(exceptionHandler(response.body));
        });
    } else {
      if(isDebug()) {
        $kba.questions = [
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
        ];

        $kba.selected = [1, 2, 3];

        $success($kba);
      } else {
        $error({ message: 'Please sign in' });
      }
    }
  },

  update(answers, $success, $error) {
    let endpoint = utilities.getUrl(config.kba.update),
        auth = getAuthHeaders(),
        data = {
          kbaAnswerList: answers
        },

        intAnswer;

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    if(isUndefined(answers)) {
      console.warn('KBA answers must be passed in as an argument, update aborted!');
      return;
    }

    data.kbaAnswerList =  data.kbaAnswerList.map((question) => {
      question.answer = question.answer.trim();
      return question;
    });

    if(logger(data)) {
      return;
    }

    if(auth) {
      request
        .patch(endpoint)
        .set(auth)
        .send(data)
        .end(function(err, response) {
          if(!err) {
            $success(response.body);
          } else {
            $error(exceptionHandler(response.body));
          }
        });
    } else {
      $error({ message: 'Please sign in' });
    }
  }
};
