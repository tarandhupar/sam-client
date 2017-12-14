import { inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Http, Response, BaseRequestOptions, ResponseOptions } from '@angular/http';
import { FHService } from './fh.service';
import { WrapperService } from '../wrapper/wrapper.service'
import { Observable } from 'rxjs/Observable';

describe('src/api-kit/fh/fh.service.spec.ts', () => {

    //Todo MOCK DATA AND TEST OTHER FUNCTIONS
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        FHService,
        WrapperService,
        BaseRequestOptions,
        MockBackend,
        {
          provide: Http,
          useFactory: (backend: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions],
        }
      ],
    });
  });

  beforeEach(inject([MockBackend], (backend: MockBackend) => {
    const baseResponse = new Response(new ResponseOptions({ body: '{"response":"sot response!!"}' }));
    backend.connections.subscribe((c: MockConnection) => c.mockRespond(baseResponse));
  }));

  it('Federal Hierarchy Service: should return response when subscribed to getOrganizationById', inject([FHService], (testService: FHService) => {
    testService.getOrganizationById("fee2e0e30ce63b7bc136aeff32096c1d", false).subscribe((res: Response) => {
      expect(res['response']).toBeDefined();
      expect(res['response']).toBe('sot response!!');
    });
    testService.getOrganizationById("aaa", true, true, "active", 10, 1, "desc", true).subscribe((res: Response) => {
      expect(res['response']).toBeDefined();
      expect(res['response']).toBe('sot response!!');
    });
  }));

  it('Federal Hierarchy Service: should return response when subscribed to getOrganizations', inject([FHService], (testService: FHService) => {
    testService.getOrganizations({}).subscribe((res: Response) => {
      expect(res['response']).toBeDefined();
      expect(res['response']).toBe('sot response!!');
    });
  }));

  it('Federal Hierarchy Service: should return response when subscribed to getAccess', inject([FHService], (testService: FHService) => {
    testService.getAccess("aaa",true).subscribe((res: Response) => {
      expect(res['response']).toBeDefined();
      expect(res['response']).toBe('sot response!!');
    });
  }));

  it('Federal Hierarchy Service: should return response when subscribed to getFHOrganizationById', inject([FHService], (testService: FHService) => {
    testService.getFHOrganizationById("aaa",true).subscribe((res: Response) => {
      expect(res['response']).toBeDefined();
      expect(res['response']).toBe('sot response!!');
    });
    testService.getFHOrganizationById("aaa", true, true, "active", 10, 1, "desc", true).subscribe((res: Response) => {
      expect(res['response']).toBeDefined();
      expect(res['response']).toBe('sot response!!');
    });
  }));

  it('Federal Hierarchy Service: should return response when subscribed to getOrganizationsByIds', inject([FHService], (testService: FHService) => {
    testService.getOrganizationsByIds("aaa,bbb").subscribe((res: Response) => {
      expect(res['response']).toBeDefined();
      expect(res['response']).toBe('sot response!!');
    });
  }));

  it('Federal Hierarchy Service: should return response when subscribed to getOrganizationDetail', inject([FHService], (testService: FHService) => {
    testService.getOrganizationDetail("aaa").subscribe((res: Response) => {
      expect(res['response']).toBeDefined();
      expect(res['response']).toBe('sot response!!');
    });
  }));

  it('Federal Hierarchy Service: should return response when subscribed to getOrganizationLogo', inject([FHService], (testService: FHService) => {
    let ob = Observable.of({
      "_embedded":[{
        "_link":{
          "logo": {
            "href":"aaa"
          },
        },
        "org":{

        },
      }]
    });
    testService.getOrganizationLogo(ob,data=>{
      expect(data).toBeDefined();
    }, err =>{
      fail();
    });
  }));

  it('Federal Hierarchy Service: should return response when subscribed to getDepartments', inject([FHService], (testService: FHService) => {
    testService.getDepartments(true).subscribe((res: Response) => {
      expect(res['response']).toBeDefined();
      expect(res['response']).toBe('sot response!!');
    });
  }));

  it('Federal Hierarchy Service: should return response when subscribed to getDepartmentsByStatus', inject([FHService], (testService: FHService) => {
    testService.getDepartmentsByStatus("all").subscribe((res: Response) => {
      expect(res['response']).toBeDefined();
      expect(res['response']).toBe('sot response!!');
    });
  }));

  it('Federal Hierarchy Service: should return response when subscribed to getDepartmentAdminLanding', inject([FHService], (testService: FHService) => {
    testService.getDepartmentAdminLanding("all").subscribe((res: Response) => {
      expect(res['response']).toBeDefined();
      expect(res['response']).toBe('sot response!!');
    });
  }));

  it('Federal Hierarchy Service: should return response when subscribed to search', inject([FHService], (testService: FHService) => {
    testService.search({
      keyword: "aaa",
      pageNum: 1,
      pageSize: 10,
      parentOrganizationId: "10000000"
    }).subscribe((res: Response) => {
      expect(res['response']).toBeDefined();
      expect(res['response']).toBe('sot response!!');
    });
    testService.search({
      keyword: "aaa"
    }).subscribe((res: Response) => {
      expect(res['response']).toBeDefined();
      expect(res['response']).toBe('sot response!!');
    });
  }));

  it('Federal Hierarchy Service: should return response when subscribed to updateOrganization', inject([FHService], (testService: FHService) => {
    testService.updateOrganization("aaaa",true).subscribe((res: Response) => {
      expect(res["_body"]).toBeDefined();
      expect(JSON.parse(res['_body'])['response']).toBe('sot response!!');
    });
  }));

  it('Federal Hierarchy Service: should return response when subscribed to createOrganization', inject([FHService], (testService: FHService) => {
    testService.createOrganization({
      id:"aaa",
      type:"office"
    },"bbb","ccc").subscribe((res: Response) => {
      expect(res['response']).toBeDefined();
      expect(res['response']).toBe('sot response!!');
    });
  }));

  it('Federal Hierarchy Service: should return response when subscribed to fhSearch', inject([FHService], (testService: FHService) => {
    testService.fhSearch("aaaa", 1, 10, "all", 2, ["aaa"], true, "bbb", true).subscribe((res: Response) => {
      expect(res['response']).toBeDefined();
      expect(res['response']).toBe('sot response!!');
    });
  }));

  it('Federal Hierarchy Service: should return response when subscribed to fhSearchCount', inject([FHService], (testService: FHService) => {
    testService.fhSearchCount("aaaa", "aaa", "all", 2, ["aaa"], true, "bbb", true).subscribe((res: Response) => {
      expect(res['response']).toBeDefined();
      expect(res['response']).toBe('sot response!!');
    });
  }));

  it('Federal Hierarchy Service: should return response when subscribed to getMyOrganization', inject([FHService], (testService: FHService) => {
    testService.getMyOrganization("aaa","2").subscribe((res: Response) => {
      expect(res['response']).toBeDefined();
      expect(res['response']).toBe('sot response!!');
    });
  }));

  it('Federal Hierarchy Service: should return response when subscribed to getSearchFilterTypes', inject([FHService], (testService: FHService) => {
    testService.getSearchFilterTypes().subscribe((res: Response) => {
      expect(res['response']).toBeDefined();
      expect(res['response']).toBe('sot response!!');
    });
  }));

  it('Federal Hierarchy Service: should return response when subscribed to getFHWidgetInfo', inject([FHService], (testService: FHService) => {
    testService.getFHWidgetInfo("aaa","bbb").subscribe((res: Response) => {
      expect(res['response']).toBeDefined();
      expect(res['response']).toBe('sot response!!');
    });
  }));

  it('Federal Hierarchy Service: should return response when subscribed to requestAAC', inject([FHService], (testService: FHService) => {
    testService.requestAAC("aaa",true).subscribe((res: Response) => {
      expect(res['response']).toBeDefined();
      expect(res['response']).toBe('sot response!!');
    });
  }));

  it('Federal Hierarchy Service: should addAuthHeader()', inject([FHService], (testService: FHService) => {
    document.cookie = "iPlanetDirectoryPro=aaaa; expires=Thu, 18 Dec 2222 12:00:00 UTC; path=/";
    let options = {};
    testService.addAuthHeader(options);
    expect(options['headers']['X-Auth-Token']).toBeDefined();
  }));
});
