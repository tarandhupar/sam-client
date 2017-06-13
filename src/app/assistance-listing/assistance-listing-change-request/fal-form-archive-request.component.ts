import {Component, OnInit, Input, ViewChild} from "@angular/core";
import {FormBuilder, FormArray, FormGroup, Validators} from "@angular/forms";
import {FALFormViewModel} from "../../fal-form.model";
import {Location} from "@angular/common";
import {Router, RouterStateSnapshot, ActivatedRoute} from '@angular/router';
import {FALFormService} from "../assistance-listing-operations/fal-form.service";
import * as Cookies from 'js-cookie';
import {ProgramService} from "../../../api-kit/program/program.service";
import {falCustomValidatorsComponent} from "../validators/assistance-listing-validators";

@Component({
  providers: [FALFormService, ProgramService],
  templateUrl: 'fal-form-archive-request.template.html',
  selector: 'fal-form-archive-request'
})

export class FALFormArchiveRequestComponent implements OnInit {
  falArchiveRequestForm: FormGroup;
  pageTitle: string = "Archive an Assistance Listing";
  buttonText: string;
  pageReady: boolean = false;
  programTitle: string;
  programNumber: string;
  cookieValue: string;
  public permissions: any;
  public activeAwardsOptions = [{ label: 'yes', value: true}];

  constructor(private fb: FormBuilder, private service: FALFormService, private programService: ProgramService, private location: Location, private activatedRoute: ActivatedRoute, private router: Router) {
    let id = activatedRoute.snapshot.params['id'];
    this.service.getFAL(id).subscribe(data => {
      this.programTitle = data.data.title;
      this.programNumber = data.data.programNumber;
    });
  }

  ngOnInit() {
    this.cookieValue = Cookies.get('iPlanetDirectoryPro');

    if (this.cookieValue === null || this.cookieValue === undefined) {
      this.router.navigate(['signin']);
    }

    if (SHOW_HIDE_RESTRICTED_PAGES !== 'true') {
      this.router.navigate(['accessrestricted']);
    }

    this.programService.getPermissions(this.cookieValue, 'FAL_REQUESTS').subscribe(res => {
      this.permissions = res;
      if (this.permissions['INITIATE_CANCEL_ARCHIVE_CR'] || this.permissions['APPROVE_REJECT_ARCHIVE_CR']) {
        this.pageReady = true;
        this.createForm();
        if(this.permissions['APPROVE_REJECT_ARCHIVE_CR']) {
          this.pageTitle = "Archive an Assistance Listing";
          this.buttonText = "Archive Listing";
        }else if(this.permissions['INITIATE_CANCEL_ARCHIVE_CR']) {
          this.pageTitle = "Assistance Listing Archive Request";
          this.buttonText = "Submit Request";
        }
      }else{
        this.router.navigate['accessrestricted'];
      }
    });
  }

  createForm(){
    this.falArchiveRequestForm = this.fb.group({
        activeAwards: [[], [falCustomValidatorsComponent.checkboxRequired]],
        comment: ''
    });
  }

  public archiveRequestSubmit() {
    if(this.falArchiveRequestForm.valid)
      this.location.back();
    else{
      let comment = this.falArchiveRequestForm.get('comment');
      let activeawards = this.falArchiveRequestForm.get('activeAwards');
      comment.markAsDirty();
      comment.updateValueAndValidity();
      activeawards.markAsDirty();
      activeawards.updateValueAndValidity();
    }
  }

  public archiveRequestCancel() {
    this.location.back();
  }

}

