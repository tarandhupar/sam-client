import { Component, OnInit, Output, EventEmitter} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { UserAccessService } from "../../../api-kit/access/access.service";

@Component({
  selector : 'role-sidenav',
  templateUrl : "./role-sidenav.template.html"
})
export class RoleSideNav implements OnInit{
    constructor(private router: Router, private route: ActivatedRoute,private role: UserAccessService){ }

    @Output() pathChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() checkSelected: EventEmitter<any> = new EventEmitter<any>();

    domainList : any;
    domains : any;
    path: 'roles'|'objects' = 'roles';


    private filters = {
      domains: { options: [ ], value: [] },
    };

    ngOnInit() {
      this.determinePath();
      this.domainList = this.route.parent.snapshot.data['domains']._embedded.domainList;
      this.filters.domains.options = this.domainList.map(this.mapLabelAndName);
      this.domains = this.domainList.map(this.mapLabel);
    }

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
        let domain = {"domainName" : this.newDomain};
        this.role.postDomain(domain).subscribe(res => {
          window.location.reload();
        });
      }

    }

    onEnterClick(event){
      if(event.keyCode == 13){
        this.SubmitDomain();
      }
    }
}
