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
  successMsg: string;
  submitted: boolean;
  //program: any;
  saveProgSub: any;
  getProgSub:any;
  programId: string = null;

  constructor(private route: ActivatedRoute, private router: Router, private programService: ProgramService){}

  ngOnInit(){

    this.programId = this.route.snapshot.params['id'];

    this.getProgSub = this.programService.getProgramById(this.programId)
      .subscribe(api => {
        console.log('AJAX Completed', api);
        let title = api.data.title;
        let popularName = (api.data.alternativeNames?api.data.alternativeNames[0]:'');
        let falNo = (api.data.programNumber?api.data.programNumber:'');

        if(falNo.trim().length == 6 )
          falNo = falNo.slice(3,6);
        this.programForm.patchValue({title: title, popularName:popularName, falNo:falNo});
      });

    this.programForm = new FormGroup({
      title: new FormControl(''),
      popularName: new FormControl(''),
      falNo: new FormControl(''),
    });
  }

  ngOnDestroy(){
    console.log(this.saveProgSub);
    console.log(this.getProgSub);

    if(this.saveProgSub)
      this.saveProgSub.unsubscribe();

    if(this.getProgSub)
      this.getProgSub.unsubscribe();
  }

  onCancelClick(event) {
     this.router.navigate(['/workspace']);
  }

  saveProgram(event){
    console.log(this.programId);

    let data = {
      "title": this.programForm.value.title,
      "alternativeNames": [this.programForm.value.popularName],
      "programNumber": this.programForm.value.falNo
    };

    this.saveProgSub = this.programService.saveProgram(this.programId, data)
      .subscribe(id => {
        console.log('AJAX Completed', id);
        /*if(this.programId == null) {
          this.programForm.reset();
          this.successMsg = "New Assistance Listing is successfully added.";
        }
        else
          this.successMsg = "Assistance Listing is successfully updated.";

        this.submitted = true;*/
        this.router.navigate(['/workspace']);
    });

  }
}
