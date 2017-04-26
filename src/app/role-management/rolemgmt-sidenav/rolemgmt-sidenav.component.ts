import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserAccessService } from "../../../api-kit/access/access.service";
import { SamCheckboxComponent } from "sam-ui-kit/form-controls/checkbox/checkbox.component";

@Component({
  selector: 'rolemgmt-sidenav',
  templateUrl: './rolemgmt-sidenav.template.html'
})
export class RoleMgmtSidenav implements OnInit{
    accordionHeading1 : string;
    accordionName1 : string;
    accordionHeading2 : string;
    accordionName2 : string;

    public StatusCheckboxModel : any = [];
    DomiansCheckboxModel : any = [];
    requestorIds : any = [];
    statusIds : string = '';
    usersEntered : any;

    @Output() statusSelected: EventEmitter<any> = new EventEmitter<any>();
    @Output() domainSelected: EventEmitter<any> = new EventEmitter<any>();
    @Output() autoCompleteSelected : EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('statusCheckboxes')
    public statusCheckboxes: SamCheckboxComponent;

    private filters = {
      status: { options: [ ], value: [] },
      domains : { options: [ ], value: [ ]}
    };


    constructor(private router: Router, private route: ActivatedRoute,private role: UserAccessService){


    }

    ngOnInit(){
      this.accordionHeading1 = 'Status';
      this.accordionName1 = 'Status-Filter-Check-Box';
      this.accordionHeading2 = 'Domains';
      this.accordionName2 = 'Domains-Filter-Check-Box';


      this.getAccessStatus();
      this.filters.domains.options = this.route.parent.snapshot.data['domains']._embedded.domainList.map(this.mapDomainLabelAndVal);
      this.getRequestorIds();
    }

    getAccessStatus(){
      this.role.getAccessStatus('Admin').subscribe(res => {
        if(res.length > 0 ){
          res.forEach(status => {
            if(this.statusIds === ''){
              this.statusIds = this.statusIds + status.id;
            }
            else{
              this.statusIds = this.statusIds + "," + status.id;
            }
          });

          this.filters.status.options = res.map(this.mapLabelAndValue);
        }
      });
    }

    getRequestorIds(){
      this.role.getRequestorIds().subscribe( res => {
        if(res.length !=  0)
          this.requestorIds = res.map(this.mapKeyAndVal);
      });
    }

    mapKeyAndVal(val){
      return {key : val, value : val};
    }

    mapLabelAndValue(val){
      return {label : val.status, value : val.id};
    }

    mapDomainLabelAndVal(val){
      return {label : val.domainName, value: val.id};
    }

    activeFilter(event){
      if(event.length < 1)
        this.statusSelected.emit(this.statusIds);
      else
        this.statusSelected.emit(event.toString());

    }

    domainFilter(event){
      this.domainSelected.emit(event.toString());
    }

    onUserClick($event){
      console.log($event);
      this.autoCompleteSelected.emit(this.usersEntered);
      this.usersEntered = '';
    }
}
