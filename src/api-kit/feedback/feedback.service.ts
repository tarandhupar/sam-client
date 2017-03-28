import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';

export type feedbackResItemType = {
    questionId?: string,
    userId?: string,
    feedback_response: {
      type?: string,
      selected?: any,
    },
};

@Injectable()
export class FeedbackService {

  constructor(private oAPIService: WrapperService){}

  getAllQuestions(){
    var oApiParam = {
      name: 'feedback',
      suffix: '/question',
      oParam: {},
      method: 'GET'
    };

    return this.oAPIService.call(oApiParam);
  }

  createFeedback(feedbacks){
    const apiOptions: any = {
      name: 'feedback',
      suffix: '/feedback',
      method: 'POST',
      body: feedbacks
    };

    return this.oAPIService.call(apiOptions);
  }
}
