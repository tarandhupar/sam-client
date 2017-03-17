import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'object-form',
  templateUrl: 'object-form.template.html',
  providers: [  ]
})


export class ObjectFormModel{
  public mainForm: FormGroup;
  @Input() public objectFormData;
  @Input() public stickyLabel;
  @Input() public mode;
  @Output() public buttonClick = new EventEmitter();
  selectedPage: number = 0;
  loadFlag: boolean = false;
  sectionIndex = [];

  sidenavModel = {
    "label": "Assistance Listings",
    "children": []
  };

  constructor(private fb: FormBuilder) {}


  createForm(objectFormData){
    this.objectFormData = objectFormData;
    let sections = {};

    for (let section of objectFormData) {
      // dynamically generate the control groups
      let formGroup = {};
      let index = objectFormData.indexOf(section);
      this.sectionIndex[section.section] = index;

        this.sidenavModel.children[index] = {
        label : section.label,
        route: '#' + section.section
      };

      for (let field of section.fields) {
        formGroup[field.name] = '';
      }

      sections[section.section] = this.fb.group(formGroup);
    }
    this.loadFlag = true;
    this.mainForm = this.fb.group(sections);

    return this.mainForm;
  }


  onCancelClick(event) {

    this.buttonClick.emit({
      type:'cancel'
    });
  }

  onSaveContinueClick(event){


    let sectionIndex = event.target.id.lastIndexOf('_');
    let section = event.target.id.substring(0,sectionIndex);

    let data = this.getData(section);

    this.buttonClick.emit({
      type:'saveContinue',
      data: data,
      selectedPage: this.selectedPage + 1
    });


  }

  onSaveExitClick(event){

    let sectionIndex = event.target.id.lastIndexOf('_');
    let section = event.target.id.substring(0,sectionIndex);

    let data = this.getData(section);

    this.buttonClick.emit({
      type:'saveExit',
      data: data
    });
  }

  onPreviousClick(event){

    this.buttonClick.emit({
      type:'previous',
      selectedPage: this.selectedPage - 1
    });
  }

  getData(section){
    let data = {};

    let sectionIndex = this.sectionIndex[section];

    for(let field of this.objectFormData[sectionIndex].fields){
      let name = field.name;
      if(field.parent){
        data[field.parent] = {};
        if(field.saveType == 'array')
          data[field.parent][name] = [this.mainForm.controls[section].value[name]];
        else
          data[field.parent][name] = this.mainForm.controls[section].value[name];
      }
      else {
        if(field.saveType == 'array')
          data[name] = [this.mainForm.controls[section].value[name]];
        else
          data[name] = this.mainForm.controls[section].value[name];
      }
    }
    return data;
  }

  setSelectedPage(event){
    this.selectedPage = event.selectedPage;
  }

}
