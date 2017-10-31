import { OppHeaderInfoViewModel } from "./header-information.model";
import { OppContactInfoViewModel } from './contact-information.model';

describe('Opportunity Contact Information Section View Model', () => {

  let dataModel: OppContactInfoViewModel;

  it('get pocs', () => {
    let _data = {
      pointOfContact: [
        {
          type: 'primary',
          fullName: 'test name',
        },
      ],
    };
    dataModel = new OppContactInfoViewModel(_data);
    expect(dataModel.primaryPOC).toEqual({
      type: 'primary',
      fullName: 'test name'
    });
    expect(dataModel.secondaryPOC).toEqual(null);
  });
});
