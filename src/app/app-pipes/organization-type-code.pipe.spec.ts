import { OrganizationTypeCodePipe } from './organization-type-code.pipe';

describe('src/app/app-pipes/organization-type-code.pipe.spec.ts', () => {
  let pipe = new OrganizationTypeCodePipe();

  it('OrganizationTypeCodePipe: transforms a json response object to an object with label and value', () => {
    let object1 = {
      procurementAACCode: null,
      alternativeNames: null,
      description: null,
      fpdsCode:null,
      fpdsOrgId: '2547',
      cgac: '360',
      oldFPDSCode: null
    };

    let result1 = {
      label: 'CGAC Code:',
      value: '360'
    };

    let object2 = {
      procurementAACCode: null,
      alternativeNames: null,
      description: null,
      fpdsCode:null,
      fpdsOrgId: null,
      cgac: null,
      oldFPDSCode: null
    };

    let result2 = {
      label: 'CGAC Code:',
      value: ''
    };

    expect(pipe.transform(object1)).toEqual(result1);
    expect(pipe.transform(object2)).toEqual(result2);
  });
});
