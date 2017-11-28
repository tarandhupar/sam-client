import {Http, Response, BaseRequestOptions, ResponseOptions} from '@angular/http';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { DictionaryService } from './dictionary.service';
import { WrapperService } from '../wrapper/wrapper.service';
import { Observable } from "rxjs/Observable";

let serviceMock = {
  call: (apiParam)=>{
    if(apiParam['name']==="opportunity" || apiParam['name']==="contractOpportunity" || apiParam["name"]==="wageDetermination"){
      return Observable.of({
        "_embedded": {
          "dictionaries": [
            {
              "elements": [
                {
                  "elementId": "0124",
                  "code": "446",
                  "value": "446 -- Health and Personal Care Stores",
                  "description": null,
                  "elements": null,
                  "parent": null,
                  "displayValue": "446 - 446 -- Health and Personal Care Stores"
                }
              ],
              "id": "naics_code"
            },
            {
              "elements": [
                {
                  "elementId": "s",
                  "code": "s",
                  "value": "Special Notice",
                  "description": null,
                  "elements": null,
                  "parent": null,
                  "displayValue": "s - Special Notice"
                }
              ],
              "id": "procurement_type"
            },
            {
              "elements": [
                {
                  "elementId": "54",
                  "code": "69",
                  "value": "69 -- Training aids & devices",
                  "description": null,
                  "elements": null,
                  "parent": null,
                  "displayValue": "69 - 69 -- Training aids & devices"
                }
              ],
              "id": "classification_code"
            },
            {
              "elements": [
                {
                  "elementId": "7",
                  "code": "7",
                  "value": "Total Small Business",
                  "description": null,
                  "elements": null,
                  "parent": null,
                  "displayValue": "7 - Total Small Business"
                }
              ],
              "id": "set_aside_type"
            }
          ]
        },
        "_links": {
          "self": {
            "href": ""
          }
        }
      });
    } else {
      return Observable.of(JSON.parse('{"_embedded":{"jSONObjectList":[{"content":{"elements":[{"code":"yes","elements":null,"description":"Yes","element_id":"yes","value":"Yes"},{"code":"no","elements":null,"description":"No","element_id":"no","value":"No"}],"id":"yes_no"},"_links":{"self":{"href":""}}}]},"_links":{"search":{"href":"","templated":true},"self":{"href":""}}}'));
    }
  },
  processDictionariesData: ()=>{
    return Observable.of({});
  }
};

describe('src/api-kit/dictionary/dictionary.service.spec.ts', () => {
  let service: DictionaryService;

  beforeEach(()=>{
    service = new DictionaryService(<any>serviceMock);
  });

  it('should return response when a dictionary is requested', ()=>{
    service.getProgramDictionaryById("yes_no").subscribe((res: Response) => {
      expect(res['yes_no']).toBeDefined();
      expect(res['yes_no'][0]['elements']).toBeDefined();
      expect(res['yes_no'][0]['description']).toBeDefined();
      expect(res['yes_no'][0]['displayValue']).toBeDefined();
    });
  });

  it("should return a general opportunity dictionary", ()=>{
    service.getOpportunityDictionary("").subscribe(data=>{
      expect(data).toBeDefined();
    });
  });

  it("should return a general contract opportunity dictionary", ()=>{
    service.getContractOpportunityDictionary("").subscribe(data=>{
      expect(data).toBeDefined();
    });
  });

  it("should return a general wage determination dictionary", ()=>{
    service.getWageDeterminationDictionary("").subscribe(data=>{
      expect(data).toBeDefined();
    });
  });
});
