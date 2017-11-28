import { PeoplePickerAutoCompleteWrapper } from "./peoplePickerAutoCompleteWrapper.service";
import { Observable } from "rxjs/Observable";

let serviceMock = {
    getFilteredList: ()=>{
        return Observable.of([{"user":{"id":1,"accountClaimed":true,"commonName":"Kristin Wight","givenName":"Kristin","mail":"test@test.com","agencyID":100186663,"passwordResetInfo":"0:1496929225932:0:0","surName":"Wight","telephoneNumber":"1+(703)919-4503","uid":"kristin.wight@gsa.gov"},"links":[{"rel":"self","href":""}]},{"user":{"id":3,"accountClaimed":true,"commonName":"Hassan Riaz","departmentID":"100006688","givenName":"Hassan","mail":"user5743@test.com","agencyID":100038056,"passwordResetInfo":"0:1494437307857:0:0","surName":"Riaz","telephoneNumber":"1+(123)456-7890","uid":"hassan.riaz@gsa.gov"},"links":[{"rel":"self","href":""}]},{"user":{"id":2,"accountClaimed":true,"commonName":"Jonathan David-Lee Robinson","departmentID":"100006688","givenName":"Jonathan","mail":"user1234@test.com","agencyID":100167252,"surName":"Robinson","telephoneNumber":"1+(202)455-9016","uid":"jonathan.robinson@gsa.gov"},"links":[{"rel":"self","href":""}]},{"user":{"id":4,"accountClaimed":true,"commonName":"Daniel Navarrete","givenName":"Daniel","mail":"brain@test.com","agencyID":100518493,"surName":"Navarrete","telephoneNumber":"1+(202)693-1134","uid":"navarrete.daniel@dol.gov"},"links":[{"rel":"self","href":""}]},{"user":{"id":5,"accountClaimed":true,"commonName":"Randall C Miller","departmentID":"100010393","givenName":"Randall","mail":"test2@test.com","agencyID":100156642,"surName":"Miller","telephoneNumber":"_+(907)786-3466","uid":"randall_miller@fws.gov"},"links":[{"rel":"self","href":""}]},{"user":{"id":6,"accountClaimed":true,"commonName":"Christy Hermansen","givenName":"Christy","mail":"test50-9@test.com","agencyID":100009826,"surName":"Hermansen","telephoneNumber":"12025551212","uid":"christy.hermansen@connect.gov"},"links":[{"rel":"self","href":""}]},{"user":{"id":8,"accountClaimed":true,"commonName":"Michael Stephenson","departmentID":"100006688","givenName":"Michael","mail":"testingaccount@test.com","agencyID":100167252,"surName":"Stephenson","telephoneNumber":"17038595205","uid":"michael.stephenson@gsa.gov"},"links":[{"rel":"self","href":""}]}]);
    }
};

describe("api-kit/autoCompleteWrapper/peoplePickerAutoCompleteWrapper.service.spec.ts", ()=>{
    let service: PeoplePickerAutoCompleteWrapper;

    beforeEach(()=>{
        service = new PeoplePickerAutoCompleteWrapper(<any>serviceMock);
    });

    it("should process a search",()=>{
        let results = service.fetch("test",false,{});
        results.subscribe(val=>{
            expect(val).toBeDefined();
        });
    });
});