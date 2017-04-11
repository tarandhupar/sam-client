import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserAccessService } from "../../../api-kit/access/access.service";

@Component({
  selector: 'rolemgmt-sidenav',
  templateUrl: './rolemgmt-sidenav.template.html'
})
export class RoleMgmtSidenav implements OnInit{
    accordionHeading1 : string;
    accordionName1 : string;
    accordionHeading2 : string;
    accordionName2 : string;

    StatusCheckboxModel : any = [];
    DomiansCheckboxModel : any = [];
    permissionOptions : any = [];
    usersEntered : string;

    @Output() statusSelected: EventEmitter<any> = new EventEmitter<any>();
    @Output() domainSelected: EventEmitter<any> = new EventEmitter<any>();
    @Output() autoCompleteSelected : EventEmitter<any> = new EventEmitter<any>();

    private filters = {
      status: { options: [ ], value: [] },
      domains : { options: [ ], value: [ ]}
    };

    constructor(private router: Router, private route: ActivatedRoute,private role: UserAccessService){
      this.accordionHeading1 = 'Status';
      this.accordionName1 = 'Status-Filter-Check-Box';
      this.accordionHeading2 = 'Domains';
      this.accordionName2 = 'Domains-Filter-Check-Box';

      this.getAccessStatus();
      this.permissionOptions = ["Sumit", "Nithin", "Taran","Justin"];
      this.filters.domains.options = this.route.parent.snapshot.data['domains']._embedded.domainList.map(this.mapDomainLabelAndVal);
    }

    ngOnInit(){

    }

    getAccessStatus(){
      this.role.getAccessStatus('Admin').subscribe(res => {
        if(res.length > 0 ){
          this.filters.status.options = res.map(this.mapLabelAndValue);
        }
      });
    }

    mapLabelAndValue(val){
      return {label : val.status, value : val.id};
    }

    mapDomainLabelAndVal(val){
      return {label : val.domainName, value: val.id};
    }

    activeFilter(event){
      this.statusSelected.emit(event.toString());
      window.scrollTo(0,0);
    }

    domainFilter(event){
      this.domainSelected.emit(event.toString());
      window.scrollTo(0,0);
      //console.log(event);
      //console.log("domains");
      //console.log(this.DomiansCheckboxModel);
    }

    onUserClick($event){
      this.autoCompleteSelected.emit(this.usersEntered);
      //console.log(this.usersEntered);
      this.usersEntered = '';
    }
}
