import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, Input } from '@angular/core';


@Component({
  selector: 'object-form',
  templateUrl: 'object-form.template.html',
  providers: [  ]
})


export class ObjectFormModel{
  public mainForm: FormGroup;
  @Input() public objectFormData;

  constructor(private fb: FormBuilder) {}


  createForm(objectFormData){
    this.objectFormData = objectFormData;
    let sections = {};

    for (let section of objectFormData) {
      // dynamically generate the control groups
      let formGroup = {};
      for (let field of section.fields) {
        //console.log(field.name);
        //console.log(field.attributes.control);
        formGroup[field.name] = '';
      }

      sections[section.section] = this.fb.group(formGroup);
      //console.log(section);
    }
    this.mainForm = this.fb.group(sections);

    //return this.mainForm;
  }
}
