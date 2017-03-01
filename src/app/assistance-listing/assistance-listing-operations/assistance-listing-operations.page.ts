import {Component, OnInit, OnDestroy} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ProgramService } from 'api-kit';

@Component({
  moduleId: __filename,
  templateUrl: 'assistance-listing-operations.page.html',
  providers: [ProgramService]
})

export class ProgramPageOperations implements OnInit, OnDestroy {

  programForm;
  public submitted: boolean;
  program: any;
  newProgSub: any;
  getProgSub:any;

  constructor(private route: ActivatedRoute, private router: Router, private programService: ProgramService){}

  ngOnInit(){

    let programId = this.route.snapshot.params['id'];

    this.getProgSub = this.programService.getProgramById(programId)
      .subscribe(api => {
        console.log('AJAX Completed', api);
        let title = api.data.title;
        let popularName = (api.data.alternativeNames?api.data.alternativeNames[0]:'');
        let falNo = (api.data.programNumber?api.data.programNumber.slice(3,6):'');
        this.programForm.patchValue({title: title, popularName:popularName, falNo:falNo});
      });

    this.programForm = new FormGroup({
      title: new FormControl(''),
      popularName: new FormControl(''),
      falNo: new FormControl(''),
    });


  }

  ngOnDestroy(){
    this.newProgSub.unsubscribe();
    this.getProgSub.unsubscribe();
  }

  onCancelClick(event) {
    let link = ['/workspace'];
    this.router.navigate(link);
  }

  addProgram(event){

    let data = {
      "title": this.programForm.value.title,
      "alternativeNames": [this.programForm.value.popularName],
      "programNumber": this.programForm.value.falNo
    };

    this.newProgSub = this.programService.saveProgram(null, data)
      .subscribe(id => {
      console.log('AJAX Completed', id);
      //this.programForm.reset();
        this.submitted = true;
    });

  }
}
