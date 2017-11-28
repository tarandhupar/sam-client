import { FALProgramAutoCompleteWrapper } from "./falAutoCompleteWrapper.service";
import { Observable } from "rxjs/Observable";

let oProgramService = {
    falautosearch: ()=>{
        return Observable.of([{"id":"425c37e6ecd84982bb8dec9c0d6c4bd0","value":"10.025 - Plant and Animal Disease, Pest Control, and Animal Care"},{"id":"85f2c626ffb413e24219899260435826","value":"10.028 - Wildlife Services"},{"id":"5d6aff840dcf4e30a6bb8d595cd5c4aa","value":"10.029 - Avian Influenza Indemnity Program -v1"}]);
    }
};

let oDictionaryService = {
    getProgramDictionaryById: ()=>{
        return Observable.of({"program_subject_terms":[
            {
              "code": "1393",
              "elements": null,
              "description": null,
              "element_id": "0441",
              "value": "Guidance, counseling, testing",
              "parent": null,
              "displayValue": "1393 - Guidance, counseling, testing"
            },
            {
              "code": "396",
              "description": null,
              "element_id": "0167015",
              "value": "Serologic tests",
              "parent": null,
              "displayValue": "396 - Serologic tests"
            },
            {
              "code": "941",
              "description": null,
              "element_id": "0329012",
              "value": "interviewing, testing, counseling",
              "parent": null,
              "displayValue": "941 - interviewing, testing, counseling"
            },
            {
              "code": "1061",
              "description": null,
              "element_id": "0345044",
              "value": "toxic testing",
              "parent": null,
              "displayValue": "1061 - toxic testing"
            },
            {
              "code": "1080",
              "description": null,
              "element_id": "0349008",
              "value": "toxicological research, testing and development",
              "parent": null,
              "displayValue": "1080 - toxicological research, testing and development"
            },
            {
              "code": "1191",
              "description": null,
              "element_id": "0383011",
              "value": "new equipment development, testing",
              "parent": null,
              "displayValue": "1191 - new equipment development, testing"
            },
            {
              "code": "2065",
              "description": null,
              "element_id": "0593004",
              "value": "calibration, testing",
              "parent": null,
              "displayValue": "2065 - calibration, testing"
            },
            {
              "code": "2315",
              "description": null,
              "element_id": "0673007",
              "value": "genetic disease testing, counseling",
              "parent": null,
              "displayValue": "2315 - genetic disease testing, counseling"
            },
            {
              "code": "2318",
              "description": null,
              "element_id": "0673010",
              "value": "hemophilia testing, treatment",
              "parent": null,
              "displayValue": "2318 - hemophilia testing, treatment"
            },
            {
              "code": "2805",
              "description": null,
              "element_id": "0833010",
              "value": "rail test facilities, equipment",
              "parent": null,
              "displayValue": "2805 - rail test facilities, equipment"
            },
            {
              "code": "3506",
              "description": null,
              "element_id": "1019016",
              "value": "toxicity testing",
              "parent": null,
              "displayValue": "3506 - toxicity testing"
            },
            {
              "code": "3541",
              "description": null,
              "element_id": "1023020",
              "value": "toxicity testing",
              "parent": null,
              "displayValue": "3541 - toxicity testing"
            }
          ]});
    }
};

describe("api-kit/autoCompleteWrapper/falAutoCompleteWrapper.service.spec.ts", ()=>{
    let service: FALProgramAutoCompleteWrapper;

    beforeEach(()=>{
        service = new FALProgramAutoCompleteWrapper(<any>oProgramService,<any>oDictionaryService);
    });

    it("should process a program search",()=>{
        service.setFetchMethod("search");
        let results = service.fetch("10.02",false,{
            index:"RP"
        });
        results.subscribe(val=>{
            expect(val).toBeDefined();
        });
    });

    it("should process a dictionary search",()=>{
        service.setFetchMethod("search");
        let results = service.fetch("test",false,{
            index:"D"
        });
        results.subscribe(val=>{
            expect(val).toBeDefined();
        });
    });
});