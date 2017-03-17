import { UserAccessInterface } from 'api-kit';
import { UserAccessModel } from "./access.model";

const emptyResponse: UserAccessInterface = {"domainMapContent":[],"id":"sumitdang"};
const response = {"domainMapContent":[{"domain":{"id":1,"val":"AWARD"},"roleMapContent":[{"role":{"id":1,"val":null},"organizationMapContent":[{"organizations":["111","222"],"functionMapContent":[{"function":{"id":1,"val":null},"permission":[{"id":3,"val":null},{"id":4,"val":null}]},{"function":{"id":2,"val":null},"permission":[{"id":1,"val":null},{"id":2,"val":null}]}]},{"organizations":["333","444"],"functionMapContent":[{"function":{"id":1,"val":null},"permission":[{"id":11,"val":null},{"id":12,"val":null}]},{"function":{"id":2,"val":null},"permission":[{"id":21,"val":null},{"id":22,"val":null},{"id":23,"val":null}]}]}]}]}],"id":"sumitdang"};

describe('AccessModel', () => {
  let accessModel: UserAccessModel;

  it('should return all roles', () => {
    accessModel = UserAccessModel.FromResponse(response);
    let roles = accessModel.allRoles();
    expect(roles.length).toBeGreaterThan(0);
    expect(roles[0].val).toBeDefined();
    expect(roles[0].id).toBeDefined();
  });

  it('should return all organizations', () => {
    accessModel = UserAccessModel.FromResponse(response);
    let orgs = accessModel.allOrganizations();
    expect(orgs.length).toBeGreaterThan(0);
  });

  it('should return all domains', () => {
    accessModel = UserAccessModel.FromResponse(response);
    let domains = accessModel.allDomains();
    expect(domains.length).toBeGreaterThan(0);
    expect(domains[0].val).toBeDefined();
    expect(domains[0].id).toBeDefined();
  });

  it('should return all objects', () => {
    accessModel = UserAccessModel.FromResponse(response);
    let objs = accessModel.allObjects();
    expect(objs.length).toBeGreaterThan(0);
    expect(objs[0].val).toBeDefined();
    expect(objs[0].id).toBeDefined();
  });

  it('should return all permissions', () => {
    accessModel = UserAccessModel.FromResponse(response);
    let permissions = accessModel.allPermissions();
    expect(permissions.length).toBeGreaterThan(0);
    expect(permissions[0].val).toBeDefined();
    expect(permissions[0].id).toBeDefined();
  });

  it('should parse an empty response', () => {
    let emptyModel = UserAccessModel.FromResponse(emptyResponse);
    expect(emptyModel.allOrganizations().length).toBe(0);
    expect(emptyModel.allObjects().length).toBe(0);
    expect(emptyModel.allRoles().length).toBe(0);
    expect(emptyModel.allPermissions().length).toBe(0);
    expect(emptyModel.allOrganizations().length).toBe(0);
  });

  it('should convert form input to a useraccess object', () => {
    // let funcs = [
    //   { id: 5, permissions: [6, 7] },
    //   { id: 8, permissions: [9]}
    // ];
    // let access = UserAccessModel.CreateGrantObject("sumit@aol.com", 1, 2, [3, 4], funcs, 'hi');
    //
    // let expected = {
    //   messages: 'hi',
    //   user: "sumit@aol.com",
    //   roleMapContent: [
    //     {
    //       role: 1,
    //       roleData: [
    //         {
    //           domain: 2,
    //           organizationMapContent: [
    //             {
    //               orgKey: '3',
    //               functionMapContent: [
    //                 {
    //                   function: 5,
    //                   permission: [ 6, 7 ]
    //                 },
    //                 {
    //                   function: 8,
    //                   permission: [ 9 ]
    //                 }
    //               ]
    //             },
    //             {
    //               orgKey: '4',
    //               functionMapContent: [
    //                 {
    //                   function: 5,
    //                   permission: [ 6, 7 ]
    //                 },
    //                 {
    //                   function: 8,
    //                   permission: [ 9 ]
    //                 }
    //               ]
    //             }
    //           ]
    //         },
    //       ]
    //     }
    //   ]
    // };
    //
    // expect(access).toEqual(expected);
  });

  it('should prune functions if they dont contain permissions', () => {
    // let funcs = [
    //   { id: 4, permissions: [6] },
    //   { id: 5, permissions: []}
    // ];
    // let access = UserAccessModel.CreateGrantObject("sumit@aol.com", 1, 2, [3], funcs, 'hi');
    //
    // let expected = {
    //   messages: 'hi',
    //   user: "sumit@aol.com",
    //   roleMapContent: [
    //     {
    //       role: 1,
    //       roleData: [
    //         {
    //           domain: 2,
    //           organizationMapContent: [
    //             {
    //               orgKey: '3',
    //               functionMapContent: [
    //                 {
    //                   function: 4,
    //                   permission: [ 6 ]
    //                 },
    //               ]
    //             },
    //           ]
    //         },
    //       ]
    //     }
    //   ]
    // };
    //
    // expect(access).toEqual(expected);
  });
});


