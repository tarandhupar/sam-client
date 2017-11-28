import { SamErrorService } from "./error.service";
import { Observable } from "rxjs/Observable";

describe("api-kit/error/error.service.spec.ts", ()=>{
    let service: SamErrorService;

    beforeEach(()=>{
        service = new SamErrorService();
    });

    it("should add/get/remove/clear errors",()=>{
        service.addError({
            req:{
                name: "test",
                suffix: "aaa",
                method: "bbb"
            },
            res:{
                statusCode: 0
            }
        });
        let obj = service.getErrors();
        expect(obj['test']).toBeDefined();

        service.removeError({
            req:{
                name: "test",
                suffix: "aaa",
                method: "bbb"
            }
        });

        obj = service.getErrors();
        expect(obj['test']["aaa"]["bbb"]).toBeUndefined();

        service.clearAllErrors();
        obj = service.getErrors();
        expect(obj['test']).toBeUndefined();
    });

    it("should support different error codes",()=>{
        let errorCodeArr = [0,400,401,403,405,500,501,503,999];
        let obj;
        for(let code of errorCodeArr){
            service.addError({
                req:{
                    name: "test",
                    suffix: "aaa",
                    method: "test"+code
                },
                res:{
                    statusCode: code
                }
            });
            obj = service.getErrors();
            expect(obj['test']['aaa']["test"+code]).toBeDefined();
        }
    });
});