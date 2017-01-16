import { OrganizationTypeCodePipe } from './organization-type-code.pipe';




describe('OrganizationTypeCodePipe', () => {
  let pipe = new OrganizationTypeCodePipe();
  it('transforms a json response object to an object with label and value', () => {
    let object1 = {
      aacCode: null,
      alternativeNames: null,
      description: null,
      fpdsCode:null,
      fpdsOrgId: "2547",
      oldFPDSCode: null
    };
    let result1Label = "FPDS Org ID:";
    let result1Value = "2547";

    let result1 = {
      label: "FPDS Org ID:",
      value: "2547"
    };

    let object2 = {
      aacCode: null,
      alternativeNames: null,
      description: null,
      fpdsCode:null,
      fpdsOrgId: null,
      oldFPDSCode: null
    };
    let result2Label = "Old FPDS Code:";
    let result2Value = "-"

    let result2 = {
      label: "Old FPDS Code:",
      value: "-"
    };


    expect(pipe.transform(object1)).toEqual(result1);
    expect(pipe.transform(object2)).toEqual(result2);

  });
});
