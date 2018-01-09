import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {CBAFormViewModel} from "../../framework/data-model/form/cba-form.model";
import {DictionaryService} from "../../../../../api-kit/dictionary/dictionary.service";
import {SortArrayOfObjects} from "../../../../app-pipes/sort-array-object.pipe";
import {WageDeterminationService} from "../../../../../api-kit/wage-determination/wage-determination.service";

@Component({
  selector: 'cba-form-location',
  templateUrl: 'location.template.html'
})

export class CBALocationComponent implements OnInit {
  @Input() viewModel: CBAFormViewModel;
  locationForm: FormGroup;
  stateOptions: [];
  countyOptions: Array<{key: string, value: string}>;
  hasStateSelected: boolean;
  isStateWide: boolean;

  constructor(private fb: FormBuilder,
              private dictionaryService: DictionaryService,
              private wageDeterminationService: WageDeterminationService) {
    this.stateOptions = [];
    this.countyOptions = [];
    this.hasStateSelected = false;
    this.isStateWide = false;
  }

  ngOnInit() {
    this.createForm();
    if (!this.viewModel.isNew) {
      this.updateForm();
    }
    this.locationForm.valueChanges.subscribe(data => {
        this.updateViewModel(data);
      }
    );
    this.dictionaryService.getWageDeterminationDictionary('wdStates').subscribe(
      data => {
        let selectedItem: {} = null;
        let selectedState: string = this.viewModel.locationState;
        this.stateOptions = new SortArrayOfObjects().transform(data['wdStates'].map(function (stateItem) {
          let item = { key: stateItem.elementId, value: stateItem.value };

          if (selectedState && !selectedItem && stateItem.value == selectedState) {
            selectedItem = item;
          }

          return item;
        }), 'value');

        if (selectedItem) {
          this.locationForm.patchValue({
            state: selectedItem
          }, {
            emitEvent: false
          });

          this.stateChanged(selectedItem, this.viewModel.locationCounty);
        }
      },
      error => {
        console.error("Error retrieving states dictionary.", error);
      }
    );
  }

  createForm() {
    this.locationForm = this.fb.group({
      state: '',
      county: '',
      city: '',
      zip: ''
    });
  }

  updateForm() {
    this.hasStateSelected = this.viewModel.locationState;
    this.locationForm.patchValue({
      city: this.viewModel.locationCity ? this.viewModel.locationCity : '',
      zip: this.viewModel.locationZipCode ? this.viewModel.locationZipCode : ''
    }, {
      emitEvent: false
    });
  }

  stateChanged(event, county?) {
    if (event && event['key']) {
      this.wageDeterminationService.getWageDeterminationFilterCountyData({
        state: event['key']
      }).subscribe(
        data => {
          let selectedItem: {} = null;
          this.countyOptions = data._embedded.dictionaries[0].elements.map(function (countyItem) {
            let item = {key: countyItem.elementId, value: countyItem.value};
            if (county && !selectedItem && countyItem.value == county) {
              selectedItem = item;
            }
            return item;
          }).sort((a: { key: string, value: string }, b: { key: string, value: string }) => {
            if (a.value < b.value) {
              return -1;
            } else if (a.value > b.value) {
              return 1;
            } else {
              return 0;
            }
          });
          let stateWide = {key: 'Statewide', value: 'Statewide'};
          if (county == stateWide.key) {
            selectedItem = stateWide;
            this.isStateWide = true;
          }
          this.countyOptions.unshift(stateWide);
          if (selectedItem) {
            this.locationForm.patchValue({
              county: selectedItem
            }, {
              emitEvent: false
            });

          }
          this.hasStateSelected = true;
        },
        error => {
          console.error("Error retrieving county dictionary.", error);
        }
      );
    } else {
      this.locationForm.patchValue({
        county: ''
      }, {
        emitEvent: false
      });
      this.countyOptions = [];
      this.hasStateSelected = false;
    }
  }


  countyChanged(event) {
    if (event && event['key']) {
      this.isStateWide = (event['key'] == 'Statewide');
    }
  }

  updateViewModel(data) {
    this.viewModel.locationState = data['state'] ? data['state']['value'] : null;
    this.viewModel.locationCounty = data['county'] ? data['county']['value'] : null;
    this.viewModel.locationCity = data['city'];
    this.viewModel.locationZipCode = data['zip'];
  }
}
