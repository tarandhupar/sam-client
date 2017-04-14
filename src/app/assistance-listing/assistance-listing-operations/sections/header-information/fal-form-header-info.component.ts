import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FALFormService} from "../../fal-form.service";
import {FALFormViewModel} from "../../fal-form.model";

@Component({
  providers: [FALFormService],
  selector: 'fal-form-header-information',
  templateUrl: 'fal-form-header-info.template.html'
})

export class FALFormHeaderInfoComponent implements OnInit {
  //  TODO Remove and replace with call to FH to get cfdaCode using organization id
  falNoPrefix: string;

  @Input() viewModel: FALFormViewModel;
  falHeaderInfoForm: FormGroup;
  options: { value: string, label: string, name: string }[];

  constructor(private fb: FormBuilder, private service: FALFormService) {
  }

  ngOnInit() {
    this.options = [];

    this.service.getProgramList().subscribe(data => this.parseProgramList(data),
      error => {
        console.error('error retrieving program list', error);
      });

    this.falHeaderInfoForm = this.fb.group({
      'title': '',
      'alternativeNames': '',
      'programNumber': '',
      'relatedPrograms': []
    });

    this.falHeaderInfoForm.valueChanges.subscribe(data => this.updateViewModel(data));

    if (!this.viewModel.isNew) {
      this.updateForm();
    }
  }

  updateViewModel(data) {
    this.viewModel.title = data['title'];
    this.viewModel.alternativeNames = data['alternativeNames'];
    this.viewModel.programNumber = this.falNoPrefix + data['programNumber'];
    this.viewModel.relatedPrograms = data['relatedPrograms'];
  }

  parseProgramList(data) {
    let optionData = [];
    if (data._embedded && data._embedded.program) {
      for (let item of data._embedded.program) {
        optionData.push( {
          'label': item.data.programNumber + " " + item.data.title,
          'value': item.id,
          'name': 'relatedProgramsList'
        });
      }
      this.options = optionData;

      //  TODO Replace list component with auto complete which pings API for list of programs
      if (this.viewModel.relatedPrograms) {
        let selections = [];
        let relatedPrograms = this.viewModel.relatedPrograms;
        for (let relatedProgram of relatedPrograms) {
          selections.push(relatedProgram);
        }
        this.falHeaderInfoForm.patchValue({
          relatedPrograms: selections
        }, {
          emitEvent: false
        });
      }
    }
  }

  updateForm() {
    let title = this.viewModel.title;
    let popularName = (this.viewModel.alternativeNames ? this.viewModel.alternativeNames[0] : '');
    let falNo = (this.viewModel.programNumber ? this.viewModel.programNumber : '');

    if (falNo.trim().length == 6) {
      //  Need to preserve prefix, TODO: Remove once FH API lookup is established
      this.falNoPrefix = falNo.slice(0, 3);
      falNo = falNo.slice(3, 6);
    }

    this.falHeaderInfoForm.patchValue({
      title: title,
      alternativeNames: popularName,
      programNumber: falNo
    }, {
      emitEvent: false
    });
  }
}
