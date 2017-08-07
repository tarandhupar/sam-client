import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Validators as $Validators } from "../../authentication/shared/validators";
import { UserAccessService } from "../../../api-kit/access/access.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertFooterService } from "../../alerts/alert-footer/alert-footer.service";
import {SamAutocompleteComponent} from "sam-ui-kit/form-controls/autocomplete";
import { UserService } from "../user.service";
import { CapitalizePipe } from "../../app-pipes/capitalize.pipe";

@Component({
  templateUrl: './request-access.template.html',
})
export class RequestAccessPage {
  form: FormGroup;
  errors = {
    org: '',
    role: '',
    domain: '',
    superName: '',
    superEmail: '',
    comment: '',
  };

  userName: string;
  user: any = {};
  roleCategories = [];
  domainOptions = [];
  usernames : any;
  userDetail : string = '';

  userConfig = {
    keyValueConfig: {
      keyProperty: 'key',
      valueProperty: 'value'
    }
  };

  constructor(
    fb: FormBuilder,
    private userAccessService: UserAccessService,
    private route: ActivatedRoute,
    private router: Router,
    private alertFooter: AlertFooterService,
    private userService: UserService,
    private capitalize: CapitalizePipe,
  ) {
    this.form = fb.group({
      org: ['', Validators.required],
      role: ['', Validators.required],
      domain: ['', Validators.required],
      superName: ['', Validators.required],
      superEmail: ['', [Validators.required, $Validators.email]],
      comment: '',
    });
  }

  ngOnInit() {
    //this.userName = this.route.snapshot.data['userName'];
    this.user = this.userService.getUser();
    this.userName = this.user.uid;
    this.roleCategories = this.route.snapshot.data['roleCategories'].map(
      cat => {
        let options = cat.roles.map(role => {
          return {
            label: this.capitalize.transform(role.role.val),
            value: role.role.id,
            domains: role.domains,
          };
        });
        return {
          options: options,
          category: cat.category
        }
      }
    );
  }

  onRoleChange() {
    let rid = this.form.value.role;
    this.form.controls['domain'].setValue('');
    if (!rid) {
      this.domainOptions = [];
    }
    let domains = null;
    this.roleCategories.forEach(cat => {
      cat.options.forEach(option => {
        if (+option.value === +rid) {
          domains = option.domains;
        }
      });
    });
    this.domainOptions = domains.map(dom => {
      return {
        label: this.capitalize.transform(dom.val),
        value: dom.id
      }
    });
  }

  clearErrors() {
    for (let e in this.errors) {
      this.errors[e] = '';
    }
  }

  showErrors() {
    const keys = Object.keys(this.form.controls);
    keys.forEach(key => {
      let control = this.form.controls[key];
      if (control.errors) {
        if (control.errors['required']) {
          this.errors[key] = `This field is required`;
        } else if (control.errors['email']) {
          this.errors[key] = `Invalid email format`;
        }
      } else {
        this.errors[key] = '';
      }
    });
  }

  validate() {
    return this.form.valid;
  }

  updateUserData(val){
    console.log(this.userDetail);
    console.log(val);
  }

  onSubmit() {
    if (!this.validate()) {
      this.showErrors();
      return;
    }
    let val = this.form.value;
    let body = {
      requestorName: this.userName,
      supervisorName: val.superName,
      supervisorEmail: val.superEmail,
      domainId: val.domain,
      requestorMessage: val.comment,
      roleId: val.role,
      organization : { id:val.org.value, val:val.org.name}
    };

    this.userAccessService.requestAccess(body).subscribe(
      res => {
        this.router.navigate(['/profile', 'access']);
      },
      err => {
        this.alertFooter.registerFooterAlert({
          description: 'There was an error with a required service',
          type: "error",
          timer: 3200
        });
      }
    )
  }
}
