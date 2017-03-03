import { OrganizationTypeCodePipe } from './organization-type-code.pipe';

describe('OrganizationTypeCodePipe', () => {
  let pipe = new OrganizationTypeCodePipe();
  
  it('transforms a json response object to an object with label and value', () => {
    let object1 = {
      aacCode: null,
      alternativeNames: null,
      description: null,
      fpdsCode:null,
      fpdsOrgId: '2547',
      oldFPDSCode: null
    };

    let result1 = {
      label: 'FPDS Org ID:',
      value: '2547'
    };

    let object2 = {
      aacCode: null,
      alternativeNames: null,
      description: null,
      fpdsCode:null,
      fpdsOrgId: null,
      oldFPDSCode: null
    };

    let result2 = {
      label: 'FPDS Code (Old):',
      value: '-'
    };

    expect(pipe.transform(object1)).toEqual(result1);
    expect(pipe.transform(object2)).toEqual(result2);
  });
});
