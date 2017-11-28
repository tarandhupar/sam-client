import { ReportsService } from "./reports.service";
import { Observable } from "rxjs/Observable";

let serviceMock = {
    call: ()=>{
        return Observable.of(true);
    }
};

describe("api-kit/reports/reports.service.spec.ts", ()=>{
    let service: ReportsService;

    beforeEach(()=>{
        service = new ReportsService(<any>serviceMock);
    });

    it("should process getPreferenceByType()",()=>{
        service.getPreferenceByType("aaa", "bbb").subscribe(val=>{
            expect(val).toBe(true);
        });
    });
    
    it("should process savePreference()",()=>{
        service.savePreference("aaa", {}, "bbb").subscribe(val=>{
            expect(val).toBe(true);
        });
    });
    
    it("should process deletePreference()",()=>{
        service.deletePreference("aaa", "bbb").subscribe(val=>{
            expect(val).toBe(true);
        });
    });
    
    it("should process getUserRole()",()=>{
        service.getUserRole("aaa").subscribe(val=>{
            expect(val).toBe(true);
        });
    });
});