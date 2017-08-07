import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserAccessService } from "../../../api-kit/access/access.service";
import { SamCheckboxComponent } from "sam-ui-kit/form-controls/checkbox/checkbox.component";
import { CapitalizePipe } from "../../app-pipes/capitalize.pipe";

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


    constructor(
      private router: Router,
      private route: ActivatedRoute,
      private role: UserAccessService,
      private capitalize: CapitalizePipe,
    ){


    }

    ngOnInit(){
      this.accordionHeading1 = 'Status';
      this.accordionName1 = 'Status-Filter-Check-Box';
      this.accordionHeading2 = 'Domains';
      this.accordionName2 = 'Domains-Filter-Check-Box';


      if (this.route.snapshot.queryParams['domain']) {
         this.DomiansCheckboxModel = this.route.snapshot.queryParams['domain'].split(',').map(d => +d);
      }


      this.getAccessStatus();
      this.filters.domains.options = this.route.parent.snapshot.data['domains']._embedded.domainList.map((d) => {
        return this.mapDomainLabelAndVal(d);
      });
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

          this.filters.status.options = res.map((e) => { return this.mapLabelAndValue(e); });
        }
      });
    }

    getRequestorIds(){
      this.role.getRequestorIds().subscribe( res => {
        if(res && res.length)
          this.requestorIds = res.map((e) => { return this.mapKeyAndVal(e) });
        console.log(this.requestorIds);
      });
    }

    mapKeyAndVal(val){
      return {key : val, value : this.capitalize.transform(val)};
    }

    mapLabelAndValue(val){
      return {label : this.capitalize.transform(val.status), value : val.id};
    }

    mapDomainLabelAndVal(val){
      return {label : this.capitalize.transform(val.domainName), value: val.id};
    }

    activeFilter(event){
      this.statusSelected.emit(event);
    }

    domainFilter(event){
      this.domainSelected.emit(event);
    }

    onUserClick(newValue){
      let c = '';
      if (typeof newValue === 'object') {
        c = newValue.key;
      } else if (typeof newValue === 'string') {
        c = newValue;
      }

      this.autoCompleteSelected.emit(c);
      this.usersEntered = '';
    }

}
