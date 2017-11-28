import { SavedSearchService } from "./saved-search.service";
import { Observable } from "rxjs/Observable";

let wrapperServiceMock = {
    call: ()=>{
        return Observable.of(true);
    }
};

describe("api-kit/autoCompleteWrapper/autoCompleteWrapper.service.spec.ts", ()=>{
    let service: SavedSearchService;

    beforeEach(()=>{
        service = new SavedSearchService(<any>wrapperServiceMock);
    });

    it("should process a createSavedSearch()",()=>{
        service.createSavedSearch("aaa",{}).subscribe(val=>{
            expect(val).toBeDefined();
        });
    });

    it("should process a getAllSavedSearches()",()=>{
        service.getAllSavedSearches({
            keyword: "aaa",
            domain: "aaa",
            saved_date: "aaa",
            "saved_date.to": "aaa",
            "saved_date.from": "aaa",
            last_ran_date: "aaa",
            "last_ran_date.to": "aaa",
            "last_ran_date.from": "aaa",
        }).subscribe(val=>{
            expect(val).toBeDefined();
        });
        service.getAllSavedSearches({}).subscribe(val=>{
            expect(val).toBeDefined();
        });
    });

    it("should process a updateSavedSearch()",()=>{
        service.updateSavedSearch("aaa", "bbb",{}).subscribe(val=>{
            expect(val).toBeDefined();
        });
    });
    
    it("should process a updateSavedSearchUsage()",()=>{
        service.updateSavedSearchUsage("aaa", "bbb").subscribe(val=>{
            expect(val).toBeDefined();
        });
    });
    
    it("should process a getSavedSearch()",()=>{
        service.getSavedSearch("aaa", "bbb").subscribe(val=>{
            expect(val).toBeDefined();
        });
    });
    
    it("should process a deleteSavedSearch()",()=>{
        service.deleteSavedSearch("aaa", "bbb").subscribe(val=>{
            expect(val).toBeDefined();
        });
    });
});