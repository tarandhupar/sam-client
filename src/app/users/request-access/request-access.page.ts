import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { Validators as $Validators } from "app-utils/validators";
import { UserAccessService } from "../../../api-kit/access/access.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertFooterService } from "../../app-components/alert-footer/alert-footer.service";
import { UserService } from "../../role-management/user.service";
import { CapitalizePipe } from "../../app-pipes/capitalize.pipe";
import { IBreadcrumb } from "sam-ui-elements/src/ui-kit/types";

function arrayIsRequired(c: FormControl) {
  if (!c.value || !c.value.length) {
    return { arrayHasElement: { valid: false } };
  }
}

@Component({
  templateUrl: './request-access.template.html',
})
export class RequestAccessPage {
  form: FormGroup;
  errors = {
    org: '',
    role: '',
    domains: '',
    superName: '',
    superEmail: '',
    comment: '',
  };

  userName: string;
  user: any = {};
  roleCategories = [];
  domainOptions = [];

  breadCrumbs: Array<IBreadcrumb> = [
    { url: '/profile/details', breadcrumb: 'Profile' },
    { url: '/profile/access', breadcrumb: 'My Access' },
    { breadcrumb: 'Request Access'}
  ];

  submitInProgress: boolean = false;

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
      domains: ['', arrayIsRequired],
      superName: ['', Validators.required],
      superEmail: ['', [Validators.required, $Validators.email]],
      comment: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.user = this.userService.getUser();
    this.userName = this.user.uid;
    this.roleCategories = this.route.snapshot.data['roleCategories'].map(
      cat => {
        let options = cat.roles.map(role => {
          return {
            label: role.role.val,
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
    this.form.controls['domains'].setValue('');
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
        value: dom.val,
        key: ''+dom.id
      }
    });
  }

  showErrors() {
    const keys = Object.keys(this.form.controls);
    keys.forEach(key => {
      let control = this.form.controls[key];
      if (control.errors) {
        if (control.errors['required'] || control.errors['arrayHasElement']) {
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
      domainIds: val.domains.map(d => +d.key),
      requestorMessage: val.comment,
      roleId: val.role,
      organization : { id:val.org.orgKey, val:val.org.name}
    };

    this.submitInProgress = true;
    this.userAccessService.requestAccess(body).subscribe(
      res => {
        this.router.navigate(['/profile', 'access']);
      },
      err => {
        this.submitInProgress = false;
        this.alertFooter.registerFooterAlert({
          description: 'There was an error with a required service',
          type: "error",
          timer: 3200
        });
      }
    )
  }
}
