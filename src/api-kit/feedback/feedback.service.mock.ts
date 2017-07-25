import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class FeedbackServiceMock {
  getAllQuestions() {
    return Observable.of({"_embedded":{"questionList":[{"questionId":1,"questionDesc":"What do you like or dislike about beta.SAM.gov?","createdDate":"2017-03-27T14:06:12.841-0400","createdBy":"ADMIN","lastModifiedBy":"ADMIN","lastModifiedDate":"2017-03-27T14:06:12.841-0400","_links":{"self":{"href":"https://50samfeedbackcomp.apps.prod-iae.bsp.gsa.gov/feedback/v1/question?qIds=1"}},"question_options":{"type":"textarea","options":[]}},{"questionId":2,"questionDesc":"What changes or improvements would you suggest?","createdDate":"2017-03-27T14:06:12.841-0400","createdBy":"ADMIN","lastModifiedBy":"ADMIN","lastModifiedDate":"2017-03-27T14:06:12.841-0400","_links":{"self":{"href":"https://50samfeedbackcomp.apps.prod-iae.bsp.gsa.gov/feedback/v1/question?qIds=2"}},"question_options":{"type":"textarea","options":[]}},{"questionId":3,"questionDesc":"May we contact you if we have questions about your feedback?","createdDate":"2017-03-27T14:06:12.841-0400","createdBy":"ADMIN","lastModifiedBy":"ADMIN","lastModifiedDate":"2017-03-27T14:06:12.841-0400","_links":{"self":{"href":"https://50samfeedbackcomp.apps.prod-iae.bsp.gsa.gov/feedback/v1/question?qIds=3"}},"question_options":{"type":"radio-text","options":["yes","no"]}}]},"_links":{"self":{"href":"https://50samfeedbackcomp.apps.prod-iae.bsp.gsa.gov/feedback/v1/question"}}});
  }
}
