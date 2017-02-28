import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import { FormGroup, FormControl,  Validators } from '@angular/forms';
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
      title: new FormControl('', Validators.compose([
      Validators.required,
      Validators.maxLength(144)
    ])),
      popularName: new FormControl(''),
      falNo: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(3)
      ])),
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

    this.programService.saveProgram(null, data).subscribe(id => {
      console.log('AJAX Completed', id);
    })
  }

}
