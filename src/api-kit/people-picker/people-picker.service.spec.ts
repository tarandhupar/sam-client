import { PeoplePickerService } from "./people-picker.service";
import { Observable } from "rxjs/Observable";

let serviceMock = {
    call: ()=>{
        return Observable.of(true);
    }
};

describe("api-kit/people-picker/people-picker.service.spec.ts", ()=>{
    let service: PeoplePickerService;

    beforeEach(()=>{
        service = new PeoplePickerService(<any>serviceMock);
    });

    it("should process getList()",()=>{
        service.getList({
            keyword: "aaa",
            size: 10
        }).subscribe(val=>{
            expect(val).toBe(true);
        });
    });
    
    it("should process getPerson()",()=>{
        service.getPerson("aaa@email.com",{
            orderBy: "aaa",
            dir: "bbb"
        }).subscribe(val=>{
            expect(val).toBe(true);
        });

        service.getPerson("aaa@email.com",{}).subscribe(val=>{
            expect(val).toBe(true);
        });
    });
    
    it("should process getFilteredList()",()=>{
        service.getFilteredList({
            size: 10
        }).subscribe(val=>{
            expect(val).toBe(true);
        });
    });
});