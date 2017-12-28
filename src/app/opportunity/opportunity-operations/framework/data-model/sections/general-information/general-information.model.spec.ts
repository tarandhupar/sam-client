import { OppGeneralInfoViewModel } from "./general-information.model";
import any = jasmine.any;

describe('General Information Section View Model', () => {

  let dataModel: OppGeneralInfoViewModel;

  beforeEach(() => {
  });

  //Archive type
  it('get archive type returns saved archive type', () => {
    let _data = {
      archive: {
        type: "abc"
      }
    };
    dataModel = new OppGeneralInfoViewModel(_data);
    expect(dataModel.archiveType).toEqual("abc");
  });

  it('set archive type returns new archive type', () => {
    let _data = {
      archive: {
        type: "abc"
      }
    };
    dataModel = new OppGeneralInfoViewModel(_data);
    dataModel.archiveType = "def";
    expect(dataModel.archiveType).toEqual("def");
  });

  //Archive Date
  it('get archive date returns saved archive date', () => {
    let _data = {
      archive: {
        date: "2006-06-05T03:45"
      }
    };
    dataModel = new OppGeneralInfoViewModel(_data);
    expect(dataModel.archiveDate).toEqual("2006-06-05");
  });

  it('set archive date returns new archive date', () => {
    let _data = {
      archive: {
        date: "2006-06-05T03:45"
      }
    };
    dataModel = new OppGeneralInfoViewModel(_data);
    dataModel.archiveDate = "def";
    expect(dataModel.archiveDate).toEqual("def");
  });

  //IVL Vendors Create Delete Permission
  it('get vendorCDIvl returns saved vendorCDIvl', () => {
    let _data = {
      permissions: {
        ivl: {
          create: true,
          update: true,
          delete: true
        }
      }
    };
    dataModel = new OppGeneralInfoViewModel(_data);
    expect(dataModel.vendorCDIvl).toEqual("yes");
    expect(_data.permissions.ivl.create).toEqual(true);
    expect(_data.permissions.ivl.delete).toEqual(true);
    expect(_data.permissions.ivl.update).toEqual(true);
  });

  it('set vendorCDIvl returns new vendorCDIvl', () => {
    let _data = {
      permissions: {
        ivl: {
          create: false,
          update: false,
          delete: false
        }
      }
    };
    dataModel = new OppGeneralInfoViewModel(_data);
    dataModel.vendorCDIvl = "no";
    expect(_data.permissions.ivl.create).toEqual(false);
    expect(_data.permissions.ivl.delete).toEqual(false);
    expect(_data.permissions.ivl.update).toEqual(false);
  });

  //IVL Vendors View Permission
  it('get vendorViewIvl returns saved vendorViewIvl', () => {
    let _data = {
      permissions: {
        ivl: {
          read: true
        }
      }
    };
    dataModel = new OppGeneralInfoViewModel(_data);
    expect(dataModel.vendorViewIvl).toEqual("yes");
    expect(_data.permissions.ivl.read).toEqual(true);
  });

  it('set vendorViewIvl returns new vendorViewIvl', () => {
    let _data = {
      permissions: {
        ivl: {
          read: false
        }
      }
    };
    dataModel = new OppGeneralInfoViewModel(_data);
    dataModel.vendorViewIvl = "no";
    expect(_data.permissions.ivl.read).toEqual(false);
  });

  //Additional Reporting
  it('get addiReportingTypes returns saved addiReportingTypes isSelected True', () => {
    let _data = {
      flags: [{
        code:  'isRecoveryRelated',
        isSelected: true
      }]
    };
    dataModel = new OppGeneralInfoViewModel(_data);
    expect(dataModel.addiReportingTypes).toEqual([{
      code:  'isRecoveryRelated',
      isSelected: true
    }]);
    expect(_data.flags[0].isSelected).toEqual(true);
  });

  it('set addiReportingTypes returns new addiReportingTypes isSelected True', () => {
    let _data = {
      flags: [{
        code:  'isRecoveryRelated',
        isSelected: true
      }]
    };
    dataModel = new OppGeneralInfoViewModel(_data);
    dataModel.addiReportingTypes = _data.flags;
    expect(dataModel.addiReportingTypes).toEqual([{
      code:  'isRecoveryRelated',
      isSelected: true
    }]);
    expect(_data.flags[0].isSelected).toEqual(true);
  });
  it('get addiReportingTypes returns saved addiReportingTypes isSelected False', () => {
    let _data = {
      flags: [{
        code:  'isRecoveryRelated',
        isSelected: false
      }]
    };
    dataModel = new OppGeneralInfoViewModel(_data);
    expect(dataModel.addiReportingTypes).toEqual([{
      code:  'isRecoveryRelated',
      isSelected: false
    }]);
    expect(_data.flags[0].isSelected).toEqual(false);
  });

  it('set addiReportingTypes returns new addiReportingTypes isSelected False', () => {
    let _data = {
      flags: [{
        code:  'isRecoveryRelated',
        isSelected: false
      }]
    };
    dataModel = new OppGeneralInfoViewModel(_data);
    dataModel.addiReportingTypes = _data.flags;
    expect(dataModel.addiReportingTypes).toEqual([{
      code:  'isRecoveryRelated',
      isSelected: false
    }]);
    expect(_data.flags[0].isSelected).toEqual(false);
  });

});
