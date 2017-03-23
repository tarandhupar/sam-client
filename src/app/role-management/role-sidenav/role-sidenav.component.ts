import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";


@Component({
  selector : 'role-sidenav',
  templateUrl : "./role-sidenav.template.html"
})
export class RoleSideNav implements OnInit{
    path: 'roles'|'objects' = 'roles';
    constructor(private router: Router, private route: ActivatedRoute){ }
    domains = '';

    ngOnInit() {
      //this.domains = this.route.parent.snapshot.data['domains']._embedded.domainList;
      this.determinePath();
      console.log(this.route.parent);  
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
      label: '',
      errorMessage: '',
      hint: ''
    };

    ChangeRoute(value){
      if(value === "roles")
        this.router.navigate(['/access/roles']);
      else if(value === "objects")
        this.router.navigate(['/access/objects']);
    }

    checkboxModel: any = [];
    checkboxConfig = {
      options: [
        {value: '1', label: 'Awards', name: 'checkbox-awards'},
        {value: '2', label: 'Oppurtunity', name: 'checkbox-oppurtunity'},
        {value: '3', label: 'Performance & Integrity Information', name: 'checkbox-info'},
        {value: '4', label: 'Identity and Access Management', name: 'checkbox-access'},
        {value: '5', label: 'Federal Organization', name: 'checkbox-fbo'},
        {value: '6', label: 'Entity Registration', name:'check-registration'},
        {value: '7', label: 'Wage Information', name: 'check-wage'},
        {value: '8', label: 'Sub-Awards', name: 'check-sub-awards'},
        {value: '9', label: 'Federal Assistance Listing', name: 'check-FA'},
        {value: '10', label: 'Admin', name: 'check-admin'},
        {value: '11', label: 'FPDS Reporting', name: 'check-reporting'}
      ],
      name: 'domains-checkbox',
      label: '',
      hasSelectAll: 'Yes'
    };

    determinePath(){
      //console.log("DP");
      if(this.router.url.match('roles')) {
        //console.log("roles " + this.router.url.match('roles'));
        this.path = "roles";
      }
      else if (this.router.url.match('objects')){
        //console.log("object " + this.router.url.match('objects'));
        this.path = "objects";
      }
    }

}
