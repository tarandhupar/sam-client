import { Component, OnInit, Output, EventEmitter} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { UserAccessService } from "../../../api-kit/access/access.service";
import { IBreadcrumb, OptionsType } from "sam-ui-elements/src/ui-kit/types";
import { CapitalizePipe } from "../../app-pipes/capitalize.pipe";
import { AlertFooterService } from "../../app-components/alert-footer/alert-footer.service";
import { PropertyCollector } from "../../app-utils/property-collector";
import { uniq } from 'lodash';

@Component({
  selector : 'role-sidenav',
  templateUrl : "./role-sidenav.template.html"
})
export class RoleSideNav implements OnInit{
    constructor(
      private router: Router,
      private route: ActivatedRoute,
      private role: UserAccessService,
      private footerAlerts: AlertFooterService,
      private capitalize: CapitalizePipe
    ){ }

    @Output() pathChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() checkSelected: EventEmitter<any> = new EventEmitter<any>();

    domainList : any;
    domains : any;
    path: 'roles'|'objects' = 'roles';
    accordionHeading1 = "Role Management Definitions";
    accordionName1 = "Role Management Definitions Filter";

    accordionHeading2 = "Domains";
    accordionName2 = "Domains Filter";

    radioConfig = {
      options: [
        {value: 'roles', label: 'Role Definitions', name: 'role-def'},
        {value: 'objects', label: 'Object Definitions', name: 'object-def'},
      ],
      name: 'role-management-definition picker',
    };

    newDomain = '';
    textErrorMessage = '';

    private filters = {
      domains: { options: [ ], value: [] },
    };

    private crumbs: Array<IBreadcrumb> = [
      { url: '/workspace', breadcrumb: 'Workspace' },
      { breadcrumb: 'Definitions' }
    ];

    ngOnInit() {
      this.determinePath();
      this.role.getDomains().subscribe(res => {
        const doms = res._embedded.domainList;
        this.filters.domains.options = doms.map((e) => { return this.mapLabelAndName(e) });
      });
    }

    ChangeRoute(value){
      if(value === "roles"){
        this.pathChange.emit('roles');
      }
      else if(value === "objects"){
        this.pathChange.emit('objects');
      }
    }

    mapLabelAndName(val) {
      return { label: val.domainName, value: val.id, name: val.domainName };
    }

    mapLabel(val) {
      return val.domainName;
    }

    mapId(val){
      return val.value;
    }

    checkboxModel: any = [];

    determinePath(){
      if(this.router.url.match('roles')) {
        this.path = "roles";
      }
      else if (this.router.url.match('objects')){
        this.path = "objects";
      }
    }

    activeFilter(event){
      this.checkSelected.emit(event.toString());
      window.scrollTo(0,0);
    }

    SubmitDomain(){
      this.textErrorMessage = '';
      let flag = 0;
      if(this.newDomain === ''){
        this.textErrorMessage = 'Domain name cannot be empty';
      }

      this.domains.forEach( val => {
          if(val.toLowerCase() === this.newDomain.toLowerCase())
              flag = 1;
      });

      if(flag === 1){
        this.textErrorMessage = 'This domain already exists';
      }
      if(this.textErrorMessage === '' && this.newDomain !== ''){
        let domain = {"domainName" : this.newDomain.toUpperCase()};
        this.role.postDomain(domain).subscribe(
          res => {
            this.newDomain = '';
            let value = JSON.parse(res._body);
            this.filters.domains.options.push({label: value.domainName, value: value.id, name: value.domainName});
            let values = this.filters.domains.options.map(this.mapId);
            this.checkSelected.emit(values.toString());
          },
          err => {
            if (err.status === 409) {
              this.footerAlerts.registerFooterAlert({
                description: 'This domain name already exists',
                type: 'error',
                timer: 3200
              });
            } else {
              this.footerAlerts.registerFooterAlert({
                description: 'Encountered an error while adding this domain.',
                type: 'error',
                timer: 3200
              });
            }
          }
        );

      }

    }

    onEnterClick(event){
      if(event.keyCode == 13){
        this.SubmitDomain();
      }
    }
}
