import { Component, OnInit, Output, Input, EventEmitter} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector : 'fh-sidenav',
  templateUrl : "./fh-sidenav.template.html"
})
export class FHSideNav implements OnInit{

  @Input() userRole:string = "superAdmin";
  @Output() orgTypeChange:EventEmitter<any> = new EventEmitter<any>();
  @Output() orgStatusChange:EventEmitter<any> = new EventEmitter<any>();
  @Output() myOrgCbxChange:EventEmitter<boolean> = new EventEmitter<boolean>();

  prevOrgType:any = [];
  orgTypeCbxModel: any = [];
  orgTypeCbxConfig = {
    options: [
      {value: '1', label: 'Dep/Ind Agency (L1)', name: 'Dep/Ind Agency'},
      {value: '2', label: 'Sub-Tier (L2)', name: 'Sub-Tier'},
      {value: '3', label: 'Office (L3)', name: 'Office'},
      {value: '4', label: 'Maj Command(L4)', name: 'Maj Command'},
      {value: '5', label: 'Sub-Command 1 (L5)', name: 'Sub-Command 1'},
      {value: '6', label: 'Sub-Command 2 (L6)', name: 'Sub-Command 2'},
      {value: '7', label: 'Sub-Command 3 (L7)', name: 'Sub-Command 3'},
    ],
    name: 'organization type',
    label: '',
  };

  orgStatusCbxModel: any = ['allActive'];
  orgStatusCbxConfig = {
    options: [
      {value: 'allActive', label: 'Active', name: 'Active'},
      {value: 'inactive', label: 'Inactive', name: 'Inactive'},
    ],
    name: 'organization status',
    label: '',
  };


  constructor(private router: Router, private route: ActivatedRoute){ }

  ngOnInit() {}

  orgSearchTypeChange(val){
    let selected = val.filter(e => this.prevOrgType.indexOf(e) < 0 );
    this.orgTypeCbxModel = selected;
    this.prevOrgType = this.orgTypeCbxModel;
    this.orgTypeChange.emit(this.orgTypeCbxModel);
  }

  orgSearchStatusChange(val){ this.orgStatusChange.emit(this.orgStatusCbxModel);}
  onSelectAdminOrg(val){ this.myOrgCbxChange.emit(val);}
}
