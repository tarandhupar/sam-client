import { NaicsService } from "./naics.service";
import { Observable } from "rxjs/Observable";

let serviceMock = {
    call: ()=>{
        return Observable.of(true);
    }
};

describe("api-kit/naics/naics.service.spec.ts", ()=>{
    let service: NaicsService;

    beforeEach(()=>{
        service = new NaicsService(<any>serviceMock);
    });

    it("should process getTopLevelNaics()",()=>{
        service.getTopLevelNaics().subscribe(val=>{
            expect(val).toBe(true);
        });
    });
    
    it("should process searchNaics()",()=>{
        service.searchNaics(["2017"], "2", "aaa").subscribe(val=>{
            expect(val).toBe(true);
        });
        service.searchNaics(null, null, "aaa").subscribe(val=>{
            expect(val).toBe(true);
        });
    });
});