import {OrganizationConfigurationPipe} from "./organization-configuration.pipe";

describe('src/app/assistance-listing/pipes/organization-configuration.pipe.spec.ts', () => {
  let pipe = new OrganizationConfigurationPipe();
  let organizationPerPage = [{
    id: 100004222,
    name: "HEALTH AND HUMAN SERVICES, DEPARTMENT OF",
    type: "DEPARTMENT"},
    {
      id: 100004343,
      name: "OFFICE OF THE GENERAL COUNSEL",
      type: "AGENCY"}];

  let list = [{
    modifiedDate: 1444334431000,
    organizationId: "100004222",
    programNumberAuto: false,
    programNumberHigh: 999,
    programNumberLow: 0}];

  let toReturn = [{
    agencyName: "HEALTH AND HUMAN SERVICES, DEPARTMENT OF",
    agencyType: "DEPARTMENT",
    organizationId: "100004222",
    modifiedDate: "October 08, 2015",
    programNumberAuto: false,
    programNumberLow: 0,
    programNumberHigh: 999},
    {

      agencyName: "OFFICE OF THE GENERAL COUNSEL",
      agencyType: "AGENCY",
      organizationId: "100004343",
      modifiedDate: "N/A",
      programNumberAuto: true,
      programNumberLow: 0,
      programNumberHigh: 999}];
  it('OrganizationConfigurationPipe: transforms to arrays to one', () => {
    expect(pipe.transform(organizationPerPage,list)).toEqual(toReturn);
  });
});
