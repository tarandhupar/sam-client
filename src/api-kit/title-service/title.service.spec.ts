import { SamTitleService } from "./title.service";
import { Observable } from "rxjs/Observable";
import { Title } from '@angular/platform-browser';

describe("api-kit/autoCompleteWrapper/autoCompleteWrapper.service.spec.ts", ()=>{
    let service: SamTitleService;
    let titleService: Title;
    beforeEach(()=>{
        titleService = new Title(null);
        service = new SamTitleService(titleService);
    });

    it("should process setting and getting titles",()=>{
        service.setTitleString("aaa");
        expect(service.getTitle()).toBe("beta.SAM.gov | aaa");

        service.setTitle("/search#aaa?bbb=ccc");
        expect(service.getTitle()).toBe("beta.SAM.gov | Search");
    });
});