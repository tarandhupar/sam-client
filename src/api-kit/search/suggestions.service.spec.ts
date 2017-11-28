import { SuggestionsService } from "./suggestions.service";
import { Observable } from "rxjs/Observable";

let wrapperServiceMock = {
    call: ()=>{
        return Observable.of(true);
    }
};

describe("api-kit/autoCompleteWrapper/autoCompleteWrapper.service.spec.ts", ()=>{
    let service: SuggestionsService;

    beforeEach(()=>{
        service = new SuggestionsService(<any>wrapperServiceMock);
    });

    it("should process a autosearch()",()=>{
        service.autosearch("aaa").subscribe(val=>{
            expect(val).toBeDefined();
        });
    });
});