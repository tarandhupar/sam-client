import {
  inject,
  TestBed
} from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';

// Load the implementations that should be tested
import { SamUIKitModule } from "sam-ui-kit";
import { SamAPIKitModule } from "api-kit";
import { DataServicePage } from "./data-service.page";
import { DataServiceModule } from "./data-service.module";
import { FileExtractsService } from "api-kit/file-extracts/file-extracts.service";


class RouterStub {
  navigate(url: string) { return url; }
}

class FileExtractsServiceStub {
  getFilesList(domain){
    return Observable.of({
      "_embedded": {
        "customS3ObjectSummaryList": [
          {
            "displayKey": "Assistance Listings",
            "dateModified": "22 May,2017",
            "bucketName": "falextracts",
            "key": "Assistance Listings/",
            "_links": {
              "self": {
                "href": "https://s3.amazonaws.com/falextracts/Assistance Listings/"
              }
            }
          },
          {
            "displayKey": "Contract Awards",
            "dateModified": "22 May,2017",
            "bucketName": "falextracts",
            "key": "Contract Awards/",
            "_links": {
              "self": {
                "href": "https://s3.amazonaws.com/falextracts/Contract Awards/"
              }
            }
          },
          {
            "displayKey": "Contract Opportunities",
            "dateModified": "22 May,2017",
            "bucketName": "falextracts",
            "key": "Contract Opportunities/",
            "_links": {
              "self": {
                "href": "https://s3.amazonaws.com/falextracts/Contract Opportunities/"
              }
            }
          },
          {
            "displayKey": "Documentation",
            "dateModified": "22 May,2017",
            "bucketName": "falextracts",
            "key": "Documentation/",
            "_links": {
              "self": {
                "href": "https://s3.amazonaws.com/falextracts/Documentation/"
              }
            }
          },
          {
            "displayKey": "Entity Information",
            "dateModified": "22 May,2017",
            "bucketName": "falextracts",
            "key": "Entity Information/",
            "_links": {
              "self": {
                "href": "https://s3.amazonaws.com/falextracts/Entity Information/"
              }
            }
          },
          {
            "displayKey": "programs-full09164.csv",
            "dateModified": "17 May,2017",
            "bucketName": "falextracts",
            "key": "programs-full09164.csv",
            "_links": {
              "self": {
                "href": "https://s3.amazonaws.com/falextracts/programs-full09164.csv"
              }
            }
          },
          {
            "displayKey": "sample.txt",
            "dateModified": "16 May,2017",
            "bucketName": "falextracts",
            "key": "sample.txt",
            "_links": {
              "self": {
                "href": "https://s3.amazonaws.com/falextracts/sample.txt"
              }
            }
          }
        ]
      },
      "_links": {
        "self": {
          "href": "https://71fileextractsservicecomp.apps.prod-iae.bsp.gsa.gov/fileextractservices/v1/api"
        }
      }
    });
  }
}

describe('Data Service Page', () => {
  // provide our implementations or mocks to the dependency injector
  let component:DataServicePage;
  let fixture:any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations:[],
      imports:[
        SamUIKitModule,
        SamAPIKitModule,
        RouterTestingModule,
        DataServiceModule,
      ],
      providers: [
        DataServicePage,
        {provide: FileExtractsService, useClass:FileExtractsServiceStub},
      ]
    });
    fixture = TestBed.createComponent(DataServicePage);
    component = fixture.componentInstance;
  });

  it("should compile without error", inject([ DataServicePage ], () => {
    fixture.detectChanges();
    expect(true).toBe(true);
  }));

  it("should be able to detect file or folder", inject([ DataServicePage ], () => {
    fixture.detectChanges();
    expect(component.isFolder("Entity Information/")).toBe(true);
    expect(component.isFolder("a.csv")).toBe(false);
    expect(component.getFileTypeClass("Entity Information/")).toBe("fa-folder");
    expect(component.getFileTypeClass("a.csv")).toBe("fa-file-text-o");
  }));

});
