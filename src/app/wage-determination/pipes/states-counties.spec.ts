import { StatesCountiesPipe } from "./states-counties.pipe";

describe('StatesCountiesPipe', () => {
  let pipe = new StatesCountiesPipe();
  let dictionaries = {county: [{dictionary_name:"county",element_id:"14343",value:"Navajo"}],
    state: [{dictionary_name:"state",element_id:"AL",value:"Alabama"}]};
  let location = [
    {
      "state": "AL",
      "statewideFlag": false,
      "counties": [14343]
    }];
  it('transforms an object to a string', () => {
    expect(pipe.transform(location, dictionaries)).toEqual({ states: 'Alabama', counties: 'Alabama - Navajo' });
  });

});
