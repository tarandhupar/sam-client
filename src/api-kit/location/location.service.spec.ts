import { LocationService } from "./location.service";
import { Observable } from "rxjs/Observable";

let serviceMock = {
    call: ()=>{
        return Observable.of(true);
    }
};

describe("api-kit/file-extracts/file-extracts.service.spec.ts", ()=>{
    let service: LocationService;

    beforeEach(()=>{
        service = new LocationService(<any>serviceMock);
    });

    it("should process getAllContries()",()=>{
        service.getAllContries().subscribe(val=>{
            expect(val).toBe(true);
        });
    });
    
    it("should process searchCountry()",()=>{
        service.searchCountry("aaa","bbb").subscribe(val=>{
            expect(val).toBe(true);
        });
    });
    
    it("should process searchCity()",()=>{
        service.searchCity("aaa","bbb", "ccc", "ddd").subscribe(val=>{
            expect(val).toBe(true);
        });
    });
    
    it("should process getAutoCompleteCountries()",()=>{
        service.getAutoCompleteCountries("aaa","bbb").subscribe(val=>{
            expect(val).toBe(true);
        });
    });
    
    it("should process getAllStates()",()=>{
        service.getAllStates("aaa").subscribe(val=>{
            expect(val).toBe(true);
        });
    });
    
    it("should process searchState()",()=>{
        service.searchState("aaa", "bbb", "ccc").subscribe(val=>{
            expect(val).toBe(true);
        });
    });
    
    it("should process getAutoCompleteCities()",()=>{
        service.getAutoCompleteCities("aaa", "bbb", "ccc", "ddd", "eee").subscribe(val=>{
            expect(val).toBe(true);
        });
    });
    
    it("should process getAutoCompleteStates()",()=>{
        service.getAutoCompleteStates("aaa", "bbb").subscribe(val=>{
            expect(val).toBe(true);
        });
    });
    
    it("should process getAllCounties()",()=>{
        service.getAllCounties("aaa").subscribe(val=>{
            expect(val).toBe(true);
        });
    });
    
    it("should process searchCounty()",()=>{
        service.searchCounty("aaa", "bbb", "ccc").subscribe(val=>{
            expect(val).toBe(true);
        });
    });
    
    it("should process getAutoCompleteCounties()",()=>{
        service.getAutoCompleteCounties("aaa", "bbb", "ccc", "ddd", "eee").subscribe(val=>{
            expect(val).toBe(true);
        });
    });
    
    it("should process getLocationByPostolCode()",()=>{
        service.getLocationByPostolCode("aaa").subscribe(val=>{
            expect(val).toBe(true);
        });
    });
    
    it("should process validateZipWIthLocation()",()=>{
        service.validateZipWIthLocation("aaa", "bbb", "ccc", "ddd").subscribe(val=>{
            expect(val).toBe(true);
        });
        service.validateZipWIthLocation("aaa").subscribe(val=>{
            expect(val).toBe(true);
        });
    });
    
    it("should process getNaicsDetails()",()=>{
        service.getNaicsDetails(2000, "bbb").subscribe(val=>{
            expect(val).toBe(true);
        });
    });
    
    it("should process getPSCDetails()",()=>{
        service.getPSCDetails("aaa").subscribe(val=>{
            expect(val).toBe(true);
        });
    });
    
    it("should process getCityAndCountyDetailsByZip()",()=>{
        service.getCityAndCountyDetailsByZip("aaa", "bbb", "ccc", "ddd").subscribe(val=>{
            expect(val).toBe(true);
        });
        service.getCityAndCountyDetailsByZip("aaa").subscribe(val=>{
            expect(val).toBe(true);
        });
    });
    
    it("should process getDistricts()",()=>{
        service.getDistricts("aaa", "bbb").subscribe(val=>{
            expect(val).toBe(true);
        });
    });
});