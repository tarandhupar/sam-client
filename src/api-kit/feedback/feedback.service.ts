import { Injectable } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import { Observable } from 'rxjs';

@Injectable()
export class SamFeedbackService {

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
}
