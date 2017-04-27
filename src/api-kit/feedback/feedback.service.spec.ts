import { inject, fakeAsync, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, Response, BaseRequestOptions, ResponseOptions, RequestMethod } from '@angular/http';
import { FeedbackService } from './feedback.service';
import { WrapperService } from '../wrapper/wrapper.service'

describe('Feedback Service', () => {
  let basicFeedback = {
    userId: "",
    feedbackList: [
      {
        questionId: 1,
        userId: "user@gsa.gov",
        feedback_response: {
          type: "radio",
          selected: ["selectedRadio"],
        }
      }
    ]
  }

  //Todo MOCK DATA AND TEST OTHER FUNCTIONS
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FeedbackService,
        WrapperService,
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        },
      ],
    });
  });

  beforeEach(inject([MockBackend], (backend: MockBackend) => {
    const baseResponse = new Response(new ResponseOptions({ body: '{"response":"res!!"}' }));
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(baseResponse));
  }));

  it('should return response when subscribed to getAllQuestions', inject([FeedbackService], (testService: FeedbackService) => {
    testService.getAllQuestions().subscribe(res => {
      expect(res['response']).toBeDefined();
      expect(res['response']).toBe('res!!');
    });
  }));

  it('should create an feedback', inject([FeedbackService, MockBackend], fakeAsync((testService: FeedbackService, backend: MockBackend) => {
    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toBe(RequestMethod.Post);
      expect(connection.request.url).toMatch(/feedback/);
    });
    testService.createFeedback(basicFeedback);
  })));
});
