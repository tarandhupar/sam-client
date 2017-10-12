import { OpportunityFormViewModel } from './opportunity-form.model';
import any = jasmine.any;

describe('src/app/opportunity/opportunity-operations/framework/data-model/opportunity-form/opportunity-form.model.spec.ts', () => {
  let dataModel: OpportunityFormViewModel;
  beforeEach(() => {
  });

  it('get opportunityId returns opportunity id', () => {
    let _opportunity = {
      id: "123",
    };
    dataModel = new OpportunityFormViewModel(_opportunity);
    expect(dataModel.opportunityId).toEqual("123");
  });

  it('set opportunityId returns updated opportunity id', () => {
    let _opportunity = {
    };
    dataModel = new OpportunityFormViewModel(_opportunity);
    dataModel.opportunityId = "22";
    expect(dataModel.opportunityId).toEqual("22");
  });

  it('isNew returns false', () => {
    let _opportunity = {
      id: "123",
    };
    dataModel = new OpportunityFormViewModel(_opportunity);
    expect(dataModel.isNew).toEqual(false);
  });

  it('isNew returns true', () => {
    let _opportunity = {
    };

    dataModel = new OpportunityFormViewModel(_opportunity);
    expect(dataModel.isNew).toEqual(true);
  });

  it('get title returns title', () => {
    let _opportunity = {
      data: {
        title: "test"
      }
    };

    dataModel = new OpportunityFormViewModel(_opportunity);
    expect(dataModel.title).toEqual("test");
  });

  it('set title returns updated title', () => {
    let _opportunity = {
      data: {
        title: "test1"
      }
    };

    dataModel = new OpportunityFormViewModel(_opportunity);
    dataModel.title = "test2";
    expect(dataModel.title).toEqual("test2");
  });

  it('get data returns data properties', () => {
    let _opportunity = {
      data: {
        title: "test1"
      }
    };

    dataModel = new OpportunityFormViewModel(_opportunity);
    expect(dataModel.data.title).toEqual("test1");
  });

  it('get description returns description', () => {
    let _opportunity = {
      description: [{
        body: "test description"
      }]
    };

    dataModel = new OpportunityFormViewModel(_opportunity);
    expect(dataModel.description).toEqual([{
      body: "test description"
    }]);
  });

  it('set description returns updated description', () => {
    let _opportunity = {
        description: [{
          body: "test description"
        }]
    };

    dataModel = new OpportunityFormViewModel(_opportunity);
    dataModel.description = [{
      body: "test description"
    }];
    expect(dataModel.description).toEqual([{
      body: "test description"
    }]);
  });
});
