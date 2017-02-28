import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ProgramService } from 'api-kit';

@Component({
  moduleId: __filename,
  templateUrl: 'assistance-listing-operations.page.html',
  providers: [ProgramService]
})

export class ProgramPageOperations implements OnInit {

  //@Input() program:Program;
  //@Output() add: EventEmitter<any> = new EventEmitter<any>();
  //@Output() cancel: EventEmitter<any> = new EventEmitter<any>();
  programForm;

  constructor(private route: ActivatedRoute, private router: Router, private programService: ProgramService){}

  ngOnInit(){

    let id = this.route.snapshot.params['id'];
    console.log(id);


    this.programForm = new FormGroup({
      title: new FormControl(''),
      popularName: new FormControl(''),
      falNo: new FormControl(''),
    });
  }

  onCancelClick(event) {
    let link = ['/programs'];
    //this.cancel.emit(null);
    this.router.navigate(link);
  }

  addProgram(event){

    let data = {
      "title": this.programForm.value.title,
      "alternativeNames": [this.programForm.value.popularName],
      "programNumber": this.programForm.value.falNo
    };

    this.programService.saveProgram(null, data)
      .subscribe(id => {
      console.log('AJAX Completed', id);
      this.programForm.reset();
    });

    /*if(this.programForm.valid){
      for(var name in this.programForm.controls) {
        (<FormControl>this.programForm.controls[name]).setValue(''); //this should work in RC4 if `Control` is not working, working same in my case
        this.programForm.controls[name].setErrors(null);
      }
    }*/

  }
}
