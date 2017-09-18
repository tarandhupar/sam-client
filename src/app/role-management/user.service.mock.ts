import { Injectable } from "@angular/core";

@Injectable()
export class UserServiceMock {
  constructor() {}

  getUser() {
    return {"firstName":"Justin","lastName":"Babbs","fullName":"Justin Babbs","email":"justin.babbs 2@gsa.gov","workPhone":"15555555555","departmentID":100006688,"agencyID":100006689,"officeID":100186596,"accountClaimed":"true","emailNotification":"no","department":100006688,"orgID":100006689,"isGov":true,"uid":"justin.babbs 2@gsa.gov","_links":{"self":{"href":"/minc/iam/auth/v4/session"}},"_id":"justin.babbs 2@gsa.gov"};
  }

  isLoggedIn() {
    return true;
  }
}
