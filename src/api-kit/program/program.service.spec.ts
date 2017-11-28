import { BaseRequestOptions, ResponseOptions, Http, Response } from '@angular/http';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { ProgramService } from './program.service';
import { WrapperService } from '../wrapper/wrapper.service'

describe('src/api-kit/program/program.service.spec.ts', () => {
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

  it('Program Service: should return response when subscribed to getRegionalOffices', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: '{"response":"sot response!!"}' }))));

    testService.getRegionalOffices({}).subscribe((res: Response) => {
      expect(res['response']).toBeDefined();
      expect(res['response']).toBe('sot response!!');
    });
  }));
  
  it('Program Service: should return response when subscribed to getRAOById', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: '{"response":"sot response!!"}' }))));

    testService.getRAOById("1",null).subscribe((res: Response) => {
      expect(res['response']).toBeDefined();
      expect(res['response']).toBe('sot response!!');
    });
  }));
  
  it('Program Service: should return response when subscribed to submitRAO', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: 'sot response!!' }))));

    testService.submitRAO(null,{},null).subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res['_body']).toBe('sot response!!');
    });
  }));

  it('Program Service: should return response when subscribed to deleteRAO', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: "sot response!!" }))));

    testService.deleteRAO("1",null).subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res['_body']).toBe('sot response!!');
    });
  }));

  it('Program Service: should return response when subscribed to getProgramById', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: '{"response":"sot response!!"}' }))));

    testService.getProgramById("fee2e0e30ce63b7bc136aeff32096c1d", 'test').subscribe((res: Response) => {
      expect(res['response']).toBeDefined();
      expect(res['response']).toBe('sot response!!');
    });
  }));

  it('Program Service: should return ID (String) when subscribed to saveProgram: Create', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: '213kj21l3j23jlk21j3kl1j2' }))));

    testService.saveProgram(null, {},'').subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res.text()).toBe('213kj21l3j23jlk21j3kl1j2');
    });
  }));

  it('Program Service: should return response when subscribed to getFederalHierarchyConfigurations', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: '{"organizationId":"100008531", "programNumberLow": 0, "programNumberHigh": 999, "programNumberAuto": true}' }))));

    testService.getFederalHierarchyConfiguration('100008531', '').subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res['organizationId']).toBe('100008531');
    });
  }));
  
  it('Program Service: should return response when subscribed to getFederalHierarchyConfigurations', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: '[{"organizationId":"100008531", "programNumberLow": 0, "programNumberHigh": 999, "programNumberAuto": true}]' }))));

    testService.getFederalHierarchyConfigurations('100008531').subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res[0]['organizationId']).toBe('100008531');
    });
  }));
  
  it('Program Service: should return response when subscribed to isProgramNumberUnique', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: '{"test":true}' }))));

    testService.getNextAvailableProgramNumber('aaaaa', 'bbb').subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res['test']).toBe(true);
    });
  }));

  it('Program Service: should return response when subscribed to isProgramNumberUnique', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: '{"content":{"isProgramNumberUnique":true}}' }))));

    testService.isProgramNumberUnique('93.869', 'b0b3ad4c60f3451b88b34471ff71c42a',  '').subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res['content']['isProgramNumberUnique']).toBe(true);
    });
  }));
  
  it('Program Service: should return response when subscribed to getRequests', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: '{"test":true}' }))));

    testService.getRequests({}).subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res['test']).toBe(true);
    });
  }));
  
  it('Program Service: should return response when subscribed to runProgram', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: '{"test":true}' }))));

    testService.runProgram({}).subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res['test']).toBe(true);
    });
  }));
  
  it('Program Service: should return response when subscribed to saveProgram', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: 'test' }))));

    testService.saveProgram("aaa",{},"bbb").subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res['_body']).toBe("test");
    });
  }));
  
  it('Program Service: should return response when subscribed to saveCFDAConfiguration', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: 'test' }))));

    testService.saveCFDAConfiguration("aaa",{},"bbb").subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res['_body']).toBe("test");
    });
  }));
  
  it('Program Service: should return response when subscribed to reviseProgram', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: 'test' }))));

    testService.reviseProgram("aaa","bbb").subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res['_body']).toBe("test");
    });
  }));
  
  it('Program Service: should return response when subscribed to deleteProgram', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: 'test' }))));

    testService.deleteProgram("aaa","bbb").subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res['_body']).toBe("test");
    });
  }));
  
  it('Program Service: should return response when subscribed to deleteProgram', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: 'test' }))));

    testService.deleteProgram("aaa","bbb").subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res['_body']).toBe("test");
    });
  }));
  
  it('Program Service: should return response when subscribed to getPermissions', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: '{"test":true}' }))));

    testService.getPermissions("aaa", "bbb", "ccc").subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res['test']).toBe(true);
    });
  }));
  
  it('Program Service: should return response when subscribed to getPendingRequest', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: '{"test":true}' }))));

    testService.getPendingRequest("aaa", "bbb").subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res['test']).toBe(true);
    });
  }));
  
  it('Program Service: should return response when subscribed to getCfdaCode', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: '{"test":true}' }))));

    testService.getCfdaCode("aaa").subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res['test']).toBe(true);
    });
  }));
  
  it('Program Service: should return response when subscribed to getContacts', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: '{"test":true}' }))));

    testService.getContacts("aaa").subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res['test']).toBe(true);
    });
  }));
  
  it('Program Service: should return response when subscribed to falautosearch', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: '{"test":true}' }))));

    testService.falautosearch("aaa","bbb").subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res['test']).toBe(true);
    });
  }));
  
  it('Program Service: should return response when subscribed to submitProgram', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: 'test' }))));

    testService.submitProgram("aaa",{},"bbb").subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res['_body']).toBe("test");
    });
  }));
  
  it('Program Service: should return response when subscribed to getReasons', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: '{"test":true}' }))));

    testService.getReasons("aaa","bbb").subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res['test']).toBe(true);
    });
  }));
  
  it('Program Service: should return response when subscribed to falWFRequestTypeProgram', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: 'test' }))));

    testService.falWFRequestTypeProgram("aaa",{},"bbb", "ccc").subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res['_body']).toBe("test");
    });
  }));
  
  it('Program Service: should return response when subscribed to getCountPendingRequests', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: '{"test":true}' }))));

    testService.getCountPendingRequests("aaa").subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res['test']).toBe(true);
    });
  }));
  
  it('Program Service: should return response when subscribed to sendNotification', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: '{"test":true}' }))));

    testService.sendNotification("aaa", "bbb").subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res['test']).toBe(true);
    });
  }));
  
  it('Program Service: should return response when subscribed to getActionHistoryAndNote', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: '{"test":true}' }))));

    testService.getActionHistoryAndNote("aaa", "bbb").subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res['test']).toBe(true);
    });
  }));
  
  it('Program Service: should return response when subscribed to getLatestUnpublishedRevision', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: '{"test":true}' }))));

    testService.getLatestUnpublishedRevision("aaa").subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res['test']).toBe(true);
    });
  }));
  
  it('Program Service: should return response when subscribed to getTemplate', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: 'test' }))));

    testService.getTemplate("aaa").subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res['_body']).toBe("test");
    });
  }));

  it('Program Service: should return response when subscribed to isCfdaCodeRestricted', inject([ProgramService, MockBackend], (testService: ProgramService, backend: MockBackend) => {
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(new Response(new ResponseOptions({ body: {
      "content": {
          "organizationId": "100171765",
          "cfdaCode": "45",
          "isRestricted": true
        },
        "_links": {
          "self": {
            "href": "/fac/v1/programs/federalHierarchyConfigurations/100171765/isCfdaCodeRestricted"
          }
        }
      }
    }))));

    testService.isCfdaCodeRestricted('100171765', 'b0b3ad4c60f3451b88b34471ff71c42a').subscribe((res: Response) => {
      expect(res).toBeDefined();
      expect(res['content']['isRestricted']).toBe(true);
    });
  }));

});
