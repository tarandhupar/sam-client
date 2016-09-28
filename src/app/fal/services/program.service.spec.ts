import { ProgramService } from './program.service';
import {APIService} from '../../common/service/api/api.service'
import {Http, Response, } from '@angular/http';


import { inject, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';


describe('Program Service', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProgramService,
        APIService,
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
    const baseResponse = new Response(new ResponseOptions({ body: '{"response":"sot response!!"}' }));
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(baseResponse));
  }));





  it('should return response when subscribed to getProgramById', inject([ProgramService], (testService: ProgramService) => {
    testService.getProgramById("fee2e0e30ce63b7bc136aeff32096c1d").subscribe((res: Response) => {
      expect(res['response']).toBe('sot response!!');
    });
  }));






});
