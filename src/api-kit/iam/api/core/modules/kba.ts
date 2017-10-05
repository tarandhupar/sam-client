import { isUndefined, merge } from 'lodash';
import * as Cookies from 'js-cookie';
import * as request from 'superagent';

import {
  config, utilities,
  getAuthHeaders, exceptionHandler, sanitizeRequest,
  isDebug, logger
} from './helpers';

import { getMockKBAQuestions } from './mocks';

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

    if(isDebug()) {
      $success({
        questions: getMockKBAQuestions(),
        selected: [1, 2, 3],
      });

      return;
    }

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
          $error(exceptionHandler(response));
        });
    } else {
      $error({ message: 'Please sign in' });
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
            $error(exceptionHandler(response));
          }
        });
    } else {
      $error({ message: 'Please sign in' });
    }
  }
};
