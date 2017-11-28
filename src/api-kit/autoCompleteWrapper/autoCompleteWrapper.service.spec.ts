import { AutoCompleteWrapper } from "./autoCompleteWrapper.service";
import { Observable } from "rxjs/Observable";

let searchServiceMock = {
    autosearch: ()=>{
        return Observable.of({
            "_embedded":[{"org":{"orgKey":100000000,"agencyName":"Department of Defense","categoryDesc":"DEPARTMENT","categoryId":"CAT-3","cfdaBur":0,"cfdaCode":"12","cfdaOmb":7,"createdBy":"","createdDate":1144972800000,"description":"DEPT OF DEFENSE","fpdsCode":"9700","fpdsOrgId":"9700","cgac":"097","fullParentPath":"100000000","fullParentPathName":"DEPT_OF_DEFENSE","isSourceCfda":true,"isSourceCwCfda":true,"isSourceFpds":true,"lastModifiedBy":"UI","lastModifiedDate":1493396408118,"name":"DEPT OF DEFENSE","orgCode":"ORG-1144","shortName":"DOD office of General Affairs","sourceCfdaPk":"808c942c5a840df8cb96604f8883eafb","sourceParentCfdaPk":"","summary":" Please enter the description of this organization in this text box. Also, make sure that your description is accurate and feel free to come back and update if you have missed anything","type":"DEPARTMENT","level":1,"code":"9700","orgAddresses":[],"hierarchy":[],"l1Name":"DEPT OF DEFENSE","l1OrgKey":100000000},"_link":{"self":{"href":""}}}],"_links":[{"rel":"self","href":""},{"rel":"next","href":""}]
        });
    }
};

let fhServiceMock = {
    search: ()=>{
        return Observable.of({
            "_embedded":[{"org":{"orgKey":100000000,"agencyName":"Department of Defense","categoryDesc":"DEPARTMENT","categoryId":"CAT-3","cfdaBur":0,"cfdaCode":"12","cfdaOmb":7,"createdBy":"","createdDate":1144972800000,"description":"DEPT OF DEFENSE","fpdsCode":"9700","fpdsOrgId":"9700","cgac":"097","fullParentPath":"100000000","fullParentPathName":"DEPT_OF_DEFENSE","isSourceCfda":true,"isSourceCwCfda":true,"isSourceFpds":true,"lastModifiedBy":"UI","lastModifiedDate":1493396408118,"name":"DEPT OF DEFENSE","orgCode":"ORG-1144","shortName":"DOD office of General Affairs","sourceCfdaPk":"808c942c5a840df8cb96604f8883eafb","sourceParentCfdaPk":"","summary":" Please enter the description of this organization in this text box. Also, make sure that your description is accurate and feel free to come back and update if you have missed anything","type":"DEPARTMENT","level":1,"code":"9700","orgAddresses":[],"hierarchy":[],"l1Name":"DEPT OF DEFENSE","l1OrgKey":100000000},"_link":{"self":{"href":""}}}],"_links":[{"rel":"self","href":""},{"rel":"next","href":""}]
        });
    }
};

describe("api-kit/autoCompleteWrapper/autoCompleteWrapper.service.spec.ts", ()=>{
    let service: AutoCompleteWrapper;

    beforeEach(()=>{
        service = new AutoCompleteWrapper(<any>fhServiceMock, <any>searchServiceMock);
    });

    it("should process a search",()=>{
        service.setFetchMethod("search");
        let results = service.fetch("test",false);
        results.subscribe(val=>{
            expect(val).toBeDefined();
        });
    });
    it("should process a search w/fpds settings",()=>{
        service.setFetchMethod("agencypicker");
        let results = service.fetch("test",false);
        results.subscribe(val=>{
            expect(val).toBeDefined();
        });
    });
});