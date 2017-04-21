import {SortArrayOfObjects} from "./sort-array-object.pipe";

describe('SortArrayOfObjects', () => {
  let pipe = new SortArrayOfObjects();

  it('sorts the array based on the key you want to sort', () => {
    let array1 = [
      {label: "Kellog", value: "1"},
      {label: "Anurag", value: "2"},
      {label: "Dmitriy", value: "3"},
      {label: "Prashanth", value: "4"},
      {label: "Jihad", value: "5"}
    ];

    let result1 = [
      {label: "Kellog", value: "1"},
      {label: "Anurag", value: "2"},
      {label: "Dmitriy", value: "3"},
      {label: "Prashanth", value: "4"},
      {label: "Jihad", value: "5"}
    ];

    let array2 = [
      {label: "Kellog", value: "1"},
      {label: "Anurag", value: "2"},
      {label: "Prashanth", value: "4"},
      {label: "Jihad", value: "5"},
      {label: "Dmitriy", value: "3"}
    ];

    let result2 = [
      {label: "Kellog", value: "1"},
      {label: "Anurag", value: "2"},
      {label: "Dmitriy", value: "3"},
      {label: "Prashanth", value: "4"},
      {label: "Jihad", value: "5"}
    ];

    expect(pipe.transform(array1, 'label')).toEqual(result1);
    expect(pipe.transform(array2, 'value')).toEqual(result2);
  });
});
