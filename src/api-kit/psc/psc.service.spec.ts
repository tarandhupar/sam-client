import { PscService } from "./psc.service";
import { Observable } from "rxjs/Observable";

let serviceMock = {
    call: ()=>{
        return Observable.of(true);
    }
};

describe("api-kit/psc/psc.service.spec.ts", ()=>{
    let service: PscService;

    beforeEach(()=>{
        service = new PscService(<any>serviceMock);
    });

    it("should process getTopLevelActivePscs()",()=>{
        service.getTopLevelActivePscs().subscribe(val=>{
            expect(val).toBe(true);
        });
    });
    
    it("should process searchPsc()",()=>{
        service.searchPsc("aaa", "bbb").subscribe(val=>{
            expect(val).toBe(true);
        });
    });
});