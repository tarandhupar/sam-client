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
  @Input() public objectService;
  @Input() public serviceMethod;

  constructor(private fb: FormBuilder) {}

  createForm(objectFormData){
    this.objectFormData = objectFormData;
    let sections = {};

    for (let section of objectFormData) {
      // dynamically generate the control groups
      let formGroup = {};
      for (let field of section.fields) {
        formGroup[field.name] = '';
      }

      sections[section.section] = this.fb.group(formGroup);
    }
    this.mainForm = this.fb.group(sections);

  }


  onCancelClick(event) {
    console.log("cancel clicked");
  }

  onSaveContinueClick(event){
    console.log("save and continue clicked");
    let data = {
      "title": "Test123",
      "alternativeNames": ['Test'],
      "programNumber": '124'
    };

     this.objectService.getProgramById('a3ad810cad0f5371dadbd820eb8ed8d3')
      .subscribe(id => {
        console.log('AJAX Completed', id);
        /*if(this.programId == null) {
         this.programForm.reset();
         this.successMsg = "New Assistance Listing is successfully added.";
         }
         else
         this.successMsg = "Assistance Listing is successfully updated.";

         this.submitted = true;*/

      });
  }

  onSaveExitClick(event){
    console.log("save and exit clicked");
  }

  onPreviousClick(event){
    console.log("previous clicked");
  }

}
