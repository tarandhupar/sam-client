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

  orgTypeCbxModel: any = [];
  orgTypeCbxConfig = {
    options: [
      {value: 'Department', label: 'Dp/Ind Agency (L1)', name: 'Dp/Ind Agency'},
      {value: 'Agency', label: 'Sub-Tier (L2)', name: 'Sub-Tier'},
      {value: 'Office', label: 'Office (L3)', name: 'Office'},
      {value: 'Major Command', label: 'Maj Command(L4)', name: 'Maj Command'},
      {value: 'Sub-Command 1', label: 'Sub-Command 1 (L5)', name: 'Sub-Command 1'},
      {value: 'Sub-Command 2', label: 'Sub-Command 2 (L6)', name: 'Sub-Command 2'},
      {value: 'Sub-Command 3', label: 'Sub-Command 3 (L7)', name: 'Sub-Command 3'},
    ],
    name: 'organization type',
    label: '',
  };

  orgStatusCbxModel: any = ['Active'];
  orgStatusCbxConfig = {
    options: [
      {value: 'Active', label: 'Active', name: 'Active'},
      {value: 'Inactive', label: 'Inactive', name: 'Inactive'},
    ],
    name: 'organization status',
    label: '',
  };

  constructor(private router: Router, private route: ActivatedRoute){ }

  ngOnInit() {}

  orgSearchTypeChange(val){ this.orgTypeChange.emit(this.orgTypeCbxModel);}
  orgSearchStatusChange(val){ this.orgStatusChange.emit(this.orgStatusCbxModel);}
  onSelectAdminOrg(val){ this.myOrgCbxChange.emit(val);}
}
