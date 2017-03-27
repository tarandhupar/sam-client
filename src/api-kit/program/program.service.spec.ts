import { BaseRequestOptions, ResponseOptions, Http, Response } from '@angular/http';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { ProgramService } from './program.service';
import { WrapperService } from '../wrapper/wrapper.service'

describe('Program Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProgramService,
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

  it('should return response when subscribed to getProgramById', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: '{"response":"sot response!!"}' }))));

    testService.getProgramById("fee2e0e30ce63b7bc136aeff32096c1d", '').subscribe((res: Response) => {
      expect(res['response']).toBeDefined();
      expect(res['response']).toBe('sot response!!');
    });
  }));

  it('should return ID (String) when subscribed to saveProgram: Create', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: '213kj21l3j23jlk21j3kl1j2' }))));

    testService.saveProgram(null, {},'').subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res.text()).toBe('213kj21l3j23jlk21j3kl1j2');
    });
  }));
});
