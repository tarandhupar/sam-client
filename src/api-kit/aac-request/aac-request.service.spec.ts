import { AACRequestService } from "./aac-request.service";
import { Observable } from "rxjs/Observable";

let serviceMock = {
    call: ()=>{
        return Observable.of(true);
    }
};

describe("api-kit/aac-request/aac-request.service.spec.ts", ()=>{
    let service: AACRequestService;

    beforeEach(()=>{
        service = new AACRequestService(<any>serviceMock);
    });

    it("should process getAACRequestDetail()",()=>{
        service.getAACRequestDetail("aaa").subscribe(val=>{
            expect(val).toBe(true);
        });
    });
    it("should process getAACRequestFormDetail()",()=>{
        service.getAACRequestFormDetail().subscribe(val=>{
            expect(val).toBe(true);
        });
    });
    it("should process postAACRequest()",()=>{
        service.postAACRequest("aaa").subscribe(val=>{
            expect(val).toBe(true);
        });
    });
});