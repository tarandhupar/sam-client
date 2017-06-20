import { Component, Input, ViewChild, ViewChildren, QueryList } from "@angular/core";
import { ActivatedRoute, Router} from "@angular/router";
import { FormGroup, FormBuilder, AbstractControl, FormControl } from '@angular/forms';
import { SamTextComponent } from 'sam-ui-kit/form-controls/text/text.component';
import { OrgAddrFormComponent } from '../../app-components/address-form/address-form.component';
import { LabelWrapper } from 'sam-ui-kit/wrappers/label-wrapper/label-wrapper.component';
import { FHService } from "../../../api-kit/fh/fh.service";
import { FlashMsgService } from "../flash-msg-service/flash-message.service";
import { Observable } from 'rxjs';
import { Location } from "@angular/common";

function validDateTime(c: FormControl) {
  let invalidError = {message: 'Date is invalid'};

  if (c.value === 'Invalid Date') {
    return invalidError;
  }
}

function isRequired(c: FormControl) {
  if(c.value === '') return {required:true};
}

@Component ({
  templateUrl: 'create-org.template.html'
})
export class OrgCreatePage {

  orgFormConfig:any;
  orgType:string = "";
  orgParentId:string = "";

  constructor(private builder: FormBuilder, private router: Router, private route: ActivatedRoute, private fhService: FHService, public flashMsgService:FlashMsgService, private location: Location) {}

  ngOnInit(){

    this.route.queryParams.subscribe(queryParams => {
      this.orgType = queryParams["orgType"];
      this.orgParentId = queryParams["parentID"];
      this.orgFormConfig = {
        mode: 'create',
        parentId: this.orgParentId,
        orgType: this.orgType,
      };
    });

  }
}
