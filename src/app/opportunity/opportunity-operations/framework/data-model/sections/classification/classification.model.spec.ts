import any = jasmine.any;
import { OppClassificationViewModel } from "./classification.model";

describe('Classification Section View Model' , () => {

  let dataModel : OppClassificationViewModel;

  beforeEach(() => {
  });
  //SetAsideType
  it('get setAsideType returns saved setAsideType' , () => {
    let _data = {
      solicitation : {
        setAside : "12"
      }
    };
    dataModel = new OppClassificationViewModel(_data);
    expect(dataModel.setAsideType).toEqual("12");
  });
  //ClassificationCodeType
  it('get classificationCodeType returns saved classificationCodeType' , () => {
    let _data = {
      classificationCode : "12"
    };
    dataModel = new OppClassificationViewModel(_data);
    expect(dataModel.classificationCodeType).toEqual("12");
  });

  //naicsCodeTypes
  it('get naicsCodeTypes returns saved naicsCodeTypes' , () => {
    let _data = {
      naics : [
        {
          code : [1] ,
          type : 'Primary'

        }
      ] ,
    };
    dataModel = new OppClassificationViewModel(_data);
    expect(dataModel.naicsCodeTypes).toEqual([
      {
        code : [1] ,
        type : 'Primary'
      }
    ]);
  });
  //CountryType
  it('get CountryType returns saved CountryType' , () => {
    let _data = {
      placeOfPerformance : {
        country: "UNITED STATES"
      }
    };
    dataModel = new OppClassificationViewModel(_data);
    expect(dataModel.countryType).toEqual("UNITED STATES");
  });

  //StateType
  it('get StateType returns saved StateType' , () => {
    let _data = {
      placeOfPerformance : {
        state: "Virginia"
      }
    };
    dataModel = new OppClassificationViewModel(_data);
    expect(dataModel.stateType).toEqual("Virginia");
  });

  //Zip
  it('get zip returns saved zip' , () => {
    let _data = {
      placeOfPerformance : {
        zip: "20105"
      }
    };
    dataModel = new OppClassificationViewModel(_data);
    expect(dataModel.zip).toEqual("20105");
  });
  //City
  it('get city returns saved city' , () => {
    let _data = {
      placeOfPerformance : {
        city: "Aldie"
      }
    };
    dataModel = new OppClassificationViewModel(_data);
    expect(dataModel.city).toEqual("Aldie");
  });

});

