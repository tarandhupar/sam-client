import { FileExtractsService } from "./file-extracts.service";
import { Observable } from "rxjs/Observable";

let serviceMock = {
    call: ()=>{
        return Observable.of(true);
    }
};

describe("api-kit/file-extracts/file-extracts.service.spec.ts", ()=>{
    let service: FileExtractsService;

    beforeEach(()=>{
        service = new FileExtractsService(<any>serviceMock);
    });

    it("should process getAwardsData()",()=>{
        service.getFilesList("aaa").subscribe(val=>{
            expect(val).toBe(true);
        });
    });
});