import {
    inject,
    TestBed,
    ComponentFixture
  } from '@angular/core/testing';
  import {ActivatedRoute} from '@angular/router';
  import {RouterTestingModule} from "@angular/router/testing";

  import * as Cookies from 'js-cookie';
  import {SamUIKitModule} from "sam-ui-kit";
  import {SamAPIKitModule} from "api-kit";
  import {WorkspaceModule} from "../../workspace.module";
  import {OppWidgetComponent} from './opp-widget.component';
  import {Observable} from 'rxjs';
  import {OpportunityService} from '../../../../api-kit/opportunity/opportunity.service';
  import {OpportunityAuthGuard} from '../../../../app/opportunity/components/authgaurd/authguard.service';


  let component: OppWidgetComponent;
  let fixture: ComponentFixture<OppWidgetComponent>;

  let MockOppService = {
    runOpportunity: (facets: string, cookieValue: string) => {
        return Observable.of({
            "_embedded":{
                "opportunity":[
                    {
                        "data":{
                            "type":"s",
                            "title":"Test",
                            "organizationId":100003657
                        },
                        "parent":{},
                        "related":{},
                        "status":{
                            "code":"draft","value":"Draft"
                        },
                        "archived":false,
                        "cancelled":false,
                        "latest":false,
                        "modifiedDate":1509045410467,
                        "_links":{
                            "opportunity:access":{
                                "href":"/opps/v2/opportunities/ebba358cd6974147bb3a60c7a3e93ec8"
                            },"opportunity:edit":{
                                "href":"/opps/v2/opportunities/ebba358cd6974147bb3a60c7a3e93ec8"
                            }
                        },
                        "id":"ebba358cd6974147bb3a60c7a3e93ec8"
                    },
                    {
                        "data":{
                            "type":"r",
                            "title":
                            "M4 Sources Sought",
                            "organizationId":100003657
                        },
                        "parent":{},
                        "related":{},
                        "status":{
                            "code":"draft",
                            "value":"Draft"
                        },
                        "archived":false,
                        "cancelled":false,
                        "latest":false,
                        "modifiedDate":1508979446531,
                        "_links":{
                            "opportunity:access":{
                                "href":"/opps/v2/opportunities/3200ecfb2f2342e4ba433ac56d48cbcb"
                            },
                            "opportunity:edit":{
                                "href":"/opps/v2/opportunities/3200ecfb2f2342e4ba433ac56d48cbcb"
                            }
                        },
                        "id":"3200ecfb2f2342e4ba433ac56d48cbcb"
                    }
                ],
                "facets":[
                    {
                        "name":"status",
                        "buckets":[
                            {
                                "name":"total_active","count":2702
                            },
                            {
                                "name":"total_draft","count":173
                            },
                            {
                                "name":"total_archived","count":16132
                            }
                        ]
                    },
                    {
                        "name":"status_active",
                        "buckets":[
                            {
                                "name":"total_active","count":2702
                            },
                            {
                                "name":"active_deadline_within_week","count":0
                            },
                            {
                                "name":"active_deadline_outside_week","count":3
                            }
                        ]
                    }
                ]
            }
        })
    },

    getPermissions: (cookieValue: string) => {
        return Observable.of({
            "_links":{
                "self":{
                    "href":"/opps/v2/opportunities"
                },
                "opportunity:access":{
                    "href":"/opps/v2/opportunities"
                },
                "opportunity:create":{
                    "href":"/opps/v2/opportunities"
                }
            }
        })
    }
  }

  describe('Workspace Page: Contract Opportunity Widget', () => {
    // provide our implementations or mocks to the dependency injector
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [],
        imports: [
          SamUIKitModule,
          SamAPIKitModule,
          WorkspaceModule,
          RouterTestingModule,
        ],
        providers: [
          OpportunityService,
          OppWidgetComponent,
          OpportunityAuthGuard
        ]
      })
        .overrideComponent(OppWidgetComponent, {
          set: {
            providers: [
              {provide: OpportunityService, useValue: MockOppService},
            ]
          }
        });
  
      fixture = TestBed.createComponent(OppWidgetComponent);
      component = fixture.componentInstance;
      Cookies.set('iPlanetDirectoryPro', 'FBO_AA')
      fixture.detectChanges();
    });

    it('should initialize data without error', () => {
        expect(component.permissions).toEqual({
            "_links":{
                "self":{
                    "href":"/opps/v2/opportunities"
                },
                "opportunity:access":{
                    "href":"/opps/v2/opportunities"
                },
                "opportunity:create":{
                    "href":"/opps/v2/opportunities"
                }
            }
        });
        expect(component.pieChart).toBeTruthy();
        expect(component.oppCounts.active).toBe(2702);
        expect(component.oppCounts.draft).toBe(173);
        expect(component.oppCounts.archived).toBe(16132);
        expect(component.chartCounts.active).toBe(2702);
        expect(component.chartCounts.within_week).toBe(0);
        expect(component.chartCounts.outside_week).toBe(3);
      });
});