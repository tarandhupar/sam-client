import { ExclusionService } from "./exclusion.service";
import { Observable } from "rxjs/Observable";

let serviceMock = {
    call: ()=>{
        return Observable.of(true);
    }
};

describe("api-kit/exclusion/exclusion.service.spec.ts", ()=>{
    let service: ExclusionService;

    beforeEach(()=>{
        service = new ExclusionService(<any>serviceMock);
    });

    it("should process getAwardsData()",()=>{
        service.getExclusion("aaa").subscribe(val=>{
            expect(val).toBe(true);
        });
    });
});