import { Component, OnInit, Output, Input, EventEmitter} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector : 'fh-sidenav',
  templateUrl : "./fh-sidenav.template.html"
})
export class FHSideNav implements OnInit{

  @Input() userRole:string = "superAdmin";
  @Input() types:any = [];
  @Output() orgTypeChange:EventEmitter<any> = new EventEmitter<any>();
  @Output() orgStatusChange:EventEmitter<any> = new EventEmitter<any>();
  @Output() myOrgCbxChange:EventEmitter<boolean> = new EventEmitter<boolean>();

  prevOrgType:any = [];
  orgTypeCbxModel: any = [];
  orgTypeCbxConfig = {
    options: [],
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

  ngOnInit() {
    this.orgTypeCbxConfig.options = this.types;
  }

  orgSearchTypeChange(val){
    this.orgTypeCbxModel = val;
    this.orgTypeChange.emit(this.orgTypeCbxModel);
  }

  orgSearchStatusChange(val){ this.orgStatusChange.emit(this.orgStatusCbxModel);}
  onSelectAdminOrg(val){ this.myOrgCbxChange.emit(val);}
}
