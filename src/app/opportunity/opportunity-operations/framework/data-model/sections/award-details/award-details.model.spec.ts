import { OppAwardDetailsViewModel } from "./award-details.model";
import any = jasmine.any;

describe('Award Details Section View Model', () => {
  let dataModel: OppAwardDetailsViewModel;

  beforeEach(() => {
  });

  it('component is initialized', () => {
    let _data = {
      number: '568'
    };
    dataModel = new OppAwardDetailsViewModel(_data);
    expect(dataModel).toBeDefined();
    expect(dataModel['_data']).toBeDefined();
  });

  it('get awardNumber returns saved number', () => {
    let _data = {
      number: '568'
    };
    dataModel = new OppAwardDetailsViewModel(_data);
    expect(dataModel.awardNumber).toEqual("568");
  });

  it('set awardNumber returns new number', () => {
    let _data = {
      number: '123'
    };
    dataModel = new OppAwardDetailsViewModel(_data);
    dataModel.awardNumber = "678";
    expect(dataModel.awardNumber).toEqual("678");
  });

  it('get amount returns saved dollar amount value', () => {
    let _data = {
      amount: 568
    };
    dataModel = new OppAwardDetailsViewModel(_data);
    expect(dataModel.amount).toEqual(568);
  });

  it('set amount returns new dollar amount value', () => {
    let _data = {
      amount: 123
    };
    dataModel = new OppAwardDetailsViewModel(_data);
    dataModel.amount = 678;
    expect(dataModel.amount).toEqual(678);
  });

  it('get lineItemNumber returns saved line item number', () => {
    let _data = {
      lineItemNumber: 568
    };
    dataModel = new OppAwardDetailsViewModel(_data);
    expect(dataModel.lineItemNumber).toEqual(568);
  });

  it('set lineItemNumber returns new line item number', () => {
    let _data = {
      lineItemNumber: '123'
    };
    dataModel = new OppAwardDetailsViewModel(_data);
    dataModel.lineItemNumber = '678';
    expect(dataModel.lineItemNumber).toEqual('678');
  });

  it('get deliveryOrderNumber returns saved order number', () => {
    let _data = {
      deliveryOrderNumber: '568'
    };
    dataModel = new OppAwardDetailsViewModel(_data);
    expect(dataModel.deliveryOrderNumber).toEqual("568");
  });

  it('set deliveryOrderNumber returns new order number', () => {
    let _data = {
      deliveryOrderNumber: '123'
    };
    dataModel = new OppAwardDetailsViewModel(_data);
    dataModel.deliveryOrderNumber = "678";
    expect(dataModel.deliveryOrderNumber).toEqual("678");
  });

  it('get awardeeDuns returns saved duns number', () => {
    let _data = {
      awardee : {
        duns: '123'
      }
    };
    dataModel = new OppAwardDetailsViewModel(_data);
    expect(dataModel.awardeeDuns).toEqual("123");
  });

  it('set awardeeDuns returns new duns number', () => {
    let _data = {
      awardee : {
        duns: '123'
      }
    };
    dataModel = new OppAwardDetailsViewModel(_data);
    dataModel.awardeeDuns = "678";
    expect(dataModel.awardeeDuns).toEqual("678");
  });

  it('get awardeeName returns saved name', () => {
    let _data = {
      awardee : {
        name: 'test'
      }
    };
    dataModel = new OppAwardDetailsViewModel(_data);
    expect(dataModel.awardeeName).toEqual("test");
  });

  it('set awardeeName returns new name', () => {
    let _data = {
      awardee : {
        name: 'test'
      }
    };
    dataModel = new OppAwardDetailsViewModel(_data);
    dataModel.awardeeName = "test2";
    expect(dataModel.awardeeName).toEqual("test2");
  });
});
