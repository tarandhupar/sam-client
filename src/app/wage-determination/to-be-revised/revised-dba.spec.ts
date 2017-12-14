import { WageDeterminationService } from "api-kit";
import { Observable } from "rxjs/Observable";
import { WageDeterminationRevisedDBAPage } from "./revised-dba.page";

let wageDeterminationServiceStub = {
    getWageDeterminationToBeRevised: () => {
      return Observable.of({
        _embedded: {
            dBAToBeRevisedList: [
                {wdNo:'AK170001'},
                {wdNo:'AK170002'},
                {wdNo:'AK170003'},
                {wdNo:'AK170004'}
            ]
        }
      });
    }
}

describe('src/app/wage-determination/to-be-revised/revised-dba-spec.ts', () => {
    let mockedComponent;
    
    beforeEach(() => {
        mockedComponent = new WageDeterminationRevisedDBAPage(<any>wageDeterminationServiceStub);
    });

    it('should get data from service', ()=>{
        mockedComponent.ngOnInit();
        expect(mockedComponent.dbaWageDeterminations[0]).toBe('AK170001')
    });
    
});