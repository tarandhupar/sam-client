import { AwardsService } from "./awards.service";
import { Observable } from "rxjs/Observable";

let serviceMock = {
    call: ()=>{
        return Observable.of(true);
    }
};

describe("api-kit/awards/awards.service.spec.ts", ()=>{
    let service: AwardsService;

    beforeEach(()=>{
        service = new AwardsService(<any>serviceMock);
    });

    it("should process getAwardsData()",()=>{
        service.getAwardsData("aaa").subscribe(val=>{
            expect(val).toBe(true);
        });
    });
});