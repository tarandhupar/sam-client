import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'object-form',
  templateUrl: 'object-form.template.html',
  providers: [  ]
})


export class ObjectFormModel{
  public mainForm: FormGroup;
  arrayFields = {};
  @Input() public objectFormData;
  @Output() public buttonClick = new EventEmitter();


  constructor(private fb: FormBuilder) {}


  createForm(objectFormData){
    this.objectFormData = objectFormData;
    let sections = {};

    for (let section of objectFormData) {
      // dynamically generate the control groups
      let formGroup = {};
      this.arrayFields[section.section]={};
      for (let field of section.fields) {
        formGroup[field.name] = '';
        if(field.saveType == 'array'){
          this.arrayFields[section.section][field.name] = true;
        }
      }

      sections[section.section] = this.fb.group(formGroup);
    }
    this.mainForm = this.fb.group(sections);

    return this.mainForm;
  }


  onCancelClick(event) {
    console.log("cancel clicked");
    this.buttonClick.emit({
      type:'cancel'
    });
  }

  onSaveContinueClick(event){
    console.log("save and continue clicked");

    let sectionIndex = event.target.id.lastIndexOf('_');
    let section = event.target.id.substring(0,sectionIndex);

    let data = this.getData(section);

    this.buttonClick.emit({
      type:'saveContinue',
      data: data
    });


  }

  onSaveExitClick(event){
    console.log("save and exit clicked");
    let sectionIndex = event.target.id.lastIndexOf('_');
    let section = event.target.id.substring(0,sectionIndex);

    let data = this.getData(section);

    this.buttonClick.emit({
      type:'saveExit',
      data: data
    });
  }

  onPreviousClick(event){
    console.log("previous clicked");
  }

  getData(section){
    let data = {};

    let fields = Object.keys(this.mainForm.value[section]);

    for (let field of fields) {
      if(this.arrayFields[section][field])
        data[field] = [this.mainForm.controls[section].value[field]];
      else
        data[field] = this.mainForm.controls[section].value[field];
    }
    return data;
  }

}
