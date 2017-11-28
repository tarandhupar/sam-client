import { ToggleService } from "./toggle.service";
import { Observable } from "rxjs/Observable";
import { Title } from '@angular/platform-browser';

let serviceMock = {
    call: ()=>{
        return Observable.of(true);
    }
};

describe("api-kit/autoCompleteWrapper/autoCompleteWrapper.service.spec.ts", ()=>{
    let service: ToggleService;
    
    beforeEach(()=>{
        service = new ToggleService(<any>serviceMock, null);
    });

    it("should process setting and getting titles",()=>{
        service.getToggleStatus("aaa","bbb").subscribe(val=>{
            expect(val).toBe(true);
        });
    });
});