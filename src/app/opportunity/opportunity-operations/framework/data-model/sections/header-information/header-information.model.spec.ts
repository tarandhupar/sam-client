import { OppHeaderInfoViewModel } from "./header-information.model";
import any = jasmine.any;

describe('Header Information Section View Model', () => {

  let dataModel: OppHeaderInfoViewModel;

  beforeEach(() => {
  });

  //Office
  it('get office returns saved office', () => {
    let _data = {
      organizationId: '568'
    };
    dataModel = new OppHeaderInfoViewModel(_data);
    expect(dataModel.office).toEqual("568");
  });

  it('set office returns new office', () => {
    let _data = {
      organizationId: '568'
    };
    dataModel = new OppHeaderInfoViewModel(_data);
    dataModel.office = "def";
    expect(dataModel.office).toEqual("def");
  });

  //Opportunity Type
  it('get opportunity type returns saved opportunity type', () => {
    let _data = {
      type: 'test'
    };
    dataModel = new OppHeaderInfoViewModel(_data);
    expect(dataModel.opportunityType).toEqual("test");
  });

  it('set opportunity type returns new opportunity type', () => {
    let _data = {
      type: 'test'
    };
    dataModel = new OppHeaderInfoViewModel(_data);
    dataModel.opportunityType = "def";
    expect(dataModel.opportunityType).toEqual("def");
  });

  //Procurment Id
  it('get procurementId returns saved procurementId', () => {
    let _data = {
      solicitationNumber: 'test1'
    };
    dataModel = new OppHeaderInfoViewModel(_data);
    expect(dataModel.procurementId).toEqual("test1");
  });

  it('set procurementId returns new procurementId', () => {
    let _data = {
      solicitationNumber: 'test'
    };
    dataModel = new OppHeaderInfoViewModel(_data);
    dataModel.procurementId = "test2";
    expect(dataModel.procurementId).toEqual("test2");
  });

});
