import { PscServiceImpl } from "./psc-autocomplete.service";
import { Observable } from "rxjs/Observable";

let serviceMock = {
    searchPsc: ()=>{
        return Observable.of({
            "_embedded": {
              "productServiceCodeList": [
                {
                  "pscId": 1083,
                  "pscCode": "A",
                  "pscName": "RESEARCH AND DEVELOPMENT",
                  "activeInd": "Y",
                  "activeStartDate": "1979-10-01",
                  "_links": {
                    "self": {
                      "href": ""
                    }
                  }
                }
              ]
            },
            "_links": {
              "self": {
                "href": ""
              }
            }
          });
    },
    getTopLevelActivePscs:()=>{
        return Observable.of({
            "_embedded": {
              "productServiceCodeList": [
                {
                  "pscId": 1083,
                  "pscCode": "A",
                  "pscName": "RESEARCH AND DEVELOPMENT",
                  "activeInd": "Y",
                  "activeStartDate": "1979-10-01",
                  "_links": {
                    "self": {
                      "href": ""
                    }
                  }
                }
              ]
            },
            "_links": {
              "self": {
                "href": ""
              }
            }
        });
    }
};

describe("api-kit/autoCompleteWrapper/agencyPickerAutoCompleteWrapper.service.spec.ts", ()=>{
    let service: PscServiceImpl;

    beforeEach(()=>{
        service = new PscServiceImpl(<any>serviceMock);
    });

    it("should process a default search",()=>{
        let results = service.fetch("",false,{});
        results.subscribe(val=>{
            expect(val).toBeDefined();
        });
    });
    it("should process a search",()=>{
        let results = service.fetch("test",false,{});
        results.subscribe(val=>{
            expect(val).toBeDefined();
        });
    });
});