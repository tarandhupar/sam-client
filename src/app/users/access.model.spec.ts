import { UserAccess } from 'api-kit';
import { UserAccessModel } from "./access.model";

const response: UserAccess = {"userAccessId":1,"user":"00.T.BRENDAN.MCDONOUGH@GSA.GOV","createdBy":"FTS-ADMIN","createdDate":"01/23/2008","updatedBy":"00.T.BRENDAN.MCDONOUGH@GSA.GOV","updatedDate":"08/25/2015","roleMapContent":[{"role":1,"roleData":[{"organizationContent":{"orgKey":"100186605","FunctionContent":[{"function":1,"permission":[1,12,2,14,5,6]},{"function":2,"permission":[1,12,2,14,5,6]},{"function":3,"permission":[13,3,7,8,10]},{"function":4,"permission":[11,4,9]},{"function":5,"permission":[11,4,9]},{"function":6,"permission":[15]}]},"domain":1,"email":"brendan.mcdonough@gsa.gov"}]}],"_links":{"self":{"href":"https://csp-api.sam.gov:443/rms/v1/access/00.T.BRENDAN.MCDONOUGH@GSA.GOV/"}}};
const emptyResponse: UserAccess = {"userAccessId":1,"user":"00.T.BRENDAN.MCDONOUGH@GSA.GOV","createdBy":"FTS-ADMIN","createdDate":"01/23/2008","updatedBy":"00.T.BRENDAN.MCDONOUGH@GSA.GOV","updatedDate":"08/25/2015","roleMapContent":[],"_links":{"self":{"href":"https://csp-api.sam.gov:443/rms/v1/access/00.T.BRENDAN.MCDONOUGH@GSA.GOV/?roleKey=5&domainKey=1&orgKey=1111&functionKey=11,14"}}};

describe('UserService', () => {
  let accessModel: UserAccessModel;

  it('should return all organizations', () => {
    accessModel = UserAccessModel.FromResponse(response);
    expect(accessModel.allOrganizations().length).toBeGreaterThan(0);
  });

  it('should return all domains', () => {
    accessModel = UserAccessModel.FromResponse(response);
    expect(accessModel.allDomains().length).toBeGreaterThan(0);
  });

  it('should return all roles', () => {
    accessModel = UserAccessModel.FromResponse(response);
    expect(accessModel.allRoles().length).toBeGreaterThan(0);
  });

  it('should return all objects', () => {
    accessModel = UserAccessModel.FromResponse(response);
    expect(accessModel.allObjects().length).toBeGreaterThan(0);
  });

  it('should return all permissions', () => {
    accessModel = UserAccessModel.FromResponse(response);
    expect(accessModel.allOrganizations().length).toBeGreaterThan(0);
  });

  it('should parse an empty response', () => {
    let emptyModel = UserAccessModel.FromResponse(emptyResponse);
    expect(emptyModel.allOrganizations().length).toBe(0);
    expect(emptyModel.allObjects().length).toBe(0);
    expect(emptyModel.allRoles().length).toBe(0);
    expect(emptyModel.allPermissions().length).toBe(0);
    expect(emptyModel.allOrganizations().length).toBe(0);
  });

});


