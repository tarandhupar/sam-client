import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import * as Cookies from 'js-cookie';

import {ProgramService} from 'api-kit';

@Component({
  moduleId: __filename,
  templateUrl: 'assistance-listing-operations.page.html',
  providers: [ProgramService]
})

export class ProgramPageOperations implements OnInit, OnDestroy {

  programForm;
  successMsg: string;
  submitted: boolean;
  saveProgSub: any;
  getProgSub: any;
  programId: string = null;
  currentUrl: string;
  mode: string;
  cookieValue: string

  constructor(private route: ActivatedRoute, private router: Router, private programService: ProgramService) {
  }

  ngOnInit() {
    this.programForm = this.createFormGrp();
    if (Cookies.get('iPlanetDirectoryPro') !== undefined) {
      if (SHOW_HIDE_RESTRICTED_PAGES === 'true') {
        this.cookieValue = Cookies.get('iPlanetDirectoryPro');
        this.currentUrl = document.location.href;
        this.programId = this.route.snapshot.params['id'];

        if (this.programId == null)
          this.mode = 'add';
        else
          this.mode = 'edit';


        if (this.mode == 'edit') {
          this.getProgSub = this.programService.getAuthProgramById(this.programId, this.cookieValue)
            .subscribe(api => {

              let title = api.data.title;
              let popularName = (api.data.alternativeNames ? api.data.alternativeNames[0] : '');
              let falNo = (api.data.programNumber ? api.data.programNumber : '');

              if (falNo.trim().length == 6)
                falNo = falNo.slice(3, 6);
              this.programForm.patchValue({title: title, popularName: popularName, falNo: falNo});
            });
        }
      } else {
        this.router.navigate(['accessrestricted']);
      }
    } else if (Cookies.get('iPlanetDirectoryPro') === null || Cookies.get('iPlanetDirectoryPro') === undefined) {
      this.router.navigate(['signin']);
    }
  }

  createFormGrp() {
    return ( new FormGroup({
      title: new FormControl(''),
      popularName: new FormControl(''),
      falNo: new FormControl(''),
    }));
  }


  ngOnDestroy() {

    if (this.saveProgSub)
      this.saveProgSub.unsubscribe();

    if (this.getProgSub)
      this.getProgSub.unsubscribe();
  }


  onCancelClick(event) {
    this.router.navigate(['/falworkspace']);
  }

  saveProgram(event) {
    let data = {
      "title": this.programForm.value.title,
      "alternativeNames": [this.programForm.value.popularName],
      "programNumber": this.programForm.value.falNo
    };

    this.saveProgSub = this.programService.saveProgram(this.programId, data, this.cookieValue)
      .subscribe(id => {
        this.programId = id;
        this.router.navigate(['/falworkspace']);
      });
  }
}
