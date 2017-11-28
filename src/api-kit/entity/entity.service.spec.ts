import { EntityService } from "./entity.service";
import { Observable } from "rxjs/Observable";

let serviceMock = {
    call: ()=>{
        return Observable.of(true);
    }
};

describe("api-kit/awards/awards.service.spec.ts", ()=>{
    let service: EntityService;

    beforeEach(()=>{
        service = new EntityService(<any>serviceMock);
    });

    it("should process getAwardsData()",()=>{
        service.getCoreDataById("aaa").subscribe(val=>{
            expect(val).toBe(true);
        });
    });
});