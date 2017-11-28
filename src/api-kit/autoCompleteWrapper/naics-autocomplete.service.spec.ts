import { NaicsServiceImpl } from "./naics-autocomplete.service";
import { Observable } from "rxjs/Observable";

let naicsServiceMock = {
    searchNaics: ()=>{
        return Observable.of({
            "_embedded": {
              "nAICSList": [
                {
                  "naicsId": 6879,
                  "naicsCode": "11",
                  "naicsTitle": "Agriculture, Forestry, Fishing and Hunting",
                  "naicsSize": "2",
                  "activeInd": "Y",
                  "sourceYear": "2017",
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
    getTopLevelNaics: ()=>{
        return Observable.of({
            "_embedded": {
              "nAICSList": [
                {
                  "naicsId": 6879,
                  "naicsCode": "11",
                  "naicsTitle": "Agriculture, Forestry, Fishing and Hunting",
                  "naicsSize": "2",
                  "activeInd": "Y",
                  "sourceYear": "2017",
                  "_links": {
                    "self": {
                      "href": ""
                    }
                  }
                },
                {
                  "naicsId": 7010,
                  "naicsCode": "21",
                  "naicsTitle": "Mining, Quarrying, and Oil and Gas Extraction",
                  "naicsSize": "2",
                  "activeInd": "Y",
                  "sourceYear": "2017",
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

describe("api-kit/autoCompleteWrapper/naics-autocomplete.service.spec.ts", ()=>{
    let service: NaicsServiceImpl;

    beforeEach(()=>{
        service = new NaicsServiceImpl(<any>naicsServiceMock);
    });

    it("should process a default search",()=>{
        service.setFetchMethod("search");
        let results = service.fetch("",false,{});
        results.subscribe(val=>{
            expect(val).toBeDefined();
        });
    });
    it("should process a search",()=>{
        service.setFetchMethod("search");
        service.setSourceYears(['2018']);
        service.setMaxLevel("1");
        let results = service.fetch("test",false,{});
        results.subscribe(val=>{
            expect(val).toBeDefined();
        });
    });
});