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
        date: "abc"
      }
    };
    dataModel = new OppGeneralInfoViewModel(_data);
    expect(dataModel.archiveDate).toEqual("abc");
  });

  it('set archive date returns new archive date', () => {
    let _data = {
      archive: {
        date: "abc"
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
          create: true,
          update: true,
          delete: true
        }
      }
    };
    dataModel = new OppGeneralInfoViewModel(_data);
    dataModel.vendorCDIvl = "no";
    expect(dataModel.vendorCDIvl).toEqual("no");
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
          read: true
        }
      }
    };
    dataModel = new OppGeneralInfoViewModel(_data);
    dataModel.vendorViewIvl = "no";
    expect(dataModel.vendorViewIvl).toEqual("no");
    expect(_data.permissions.ivl.read).toEqual(false);
  });

});
