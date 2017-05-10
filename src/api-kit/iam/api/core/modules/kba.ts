import { isUndefined, merge } from 'lodash';
import * as Cookies from 'js-cookie';
import * as request from 'superagent';

import {
  config, utilities,
  getAuthHeaders, exceptionHandler, sanitizeRequest,
  isDebug
} from './helpers';

export const kba = {
  questions($success, $error) {
    let endpoint = utilities.getUrl(config.kba.questions),
        headers = {
          iPlanetDirectoryPro: Cookies.get('iPlanetDirectoryPro')
        };

    $success = ($success || function(response) {});
    $error = ($error || function(error) {});

    request
      .get(endpoint)
      .set(headers)
      .end(function(err, res) {
        let $kba = {
          questions: [],
          selected: []
        };

        if(!err) {
          $kba.questions = (res.body.kbaQuestionList || []);
          $kba.selected = (res.body.kbaAnswerIdList || []).map(function(questionID) {
            return parseInt(questionID, 10);
          });

          $success($kba);
        } else {
          $error($kba);
        }
      });
  },

  update(answers, $success, $error) {
    let endpoint = utilities.getUrl(config.kba.update),
        headers = {
          iPlanetDirectoryPro: Cookies.get('iPlanetDirectoryPro')
        },

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

    data.kbaAnswerList =  data.kbaAnswerList.map(function(question) {
      question.answer = question.answer.trim();
      return question;
    });

    request
      .patch(endpoint)
      .set(headers)
      .send(data)
      .end(function(err, res) {
        if(!err) {
          $success(res);
        } else {
          $error(res);
        }
      });
  }
};
