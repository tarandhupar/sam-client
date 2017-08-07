import {Component, OnInit} from "@angular/core";
import {Router, Route, ActivatedRoute, NavigationExtras} from "@angular/router";
import {FHService} from "api-kit/fh/fh.service";
import { IAMService } from "api-kit";

@Component({
  selector: 'fh-widget',
  templateUrl: './fh-widget.template.html'
})
export class FHWidgetComponent implements OnInit {


  fhRadioModel: any = '90 completed';
  fhRadioConfig = {
    options: [
      {value: '90 completed', label: 'Last 90 days', name: 'Last 90 days'},
      {value: '0 scheduled', label: 'Scheduled', name: 'Scheduled'},
    ],
    name: 'radio-component',
    errorMessage: '',
    hint: ''
  };

  searchText = "";
  createdTotal = 0;
  expiredTotal = 0;

  widgetPermission = 'none';
  loadData:boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fhService: FHService,
    private iamService: IAMService
  ) {

  }

  ngOnInit() {
    this.iamService.iam.checkSession(
      (user) => {
        let deptOrgKey = user.departmentID && user.departmentID !== "" ? user.departmentID : "";
        this.getFHCounts();
      });
  }


  searchFH(){
    //direct to search fh landing page with search text as query param
    let navigationExtras: NavigationExtras = {
      queryParams: {keyword: this.searchText, status:['allActive']}
    };
    this.router.navigate(["/federal-hierarchy"],navigationExtras);
  }

  getFHCounts(){
    this.fhService.getFHWidgetInfo(this.fhRadioModel.split(' ')[1],this.fhRadioModel.split(' ')[0]).subscribe( data => {
      if(Object.keys(data['_links']).length > 1){
        this.createdTotal = data['startCount'];
        this.expiredTotal = data['endCount'];
        this.widgetPermission = 'all';
      } else{
        this.widgetPermission = 'partial';
      }
    }, error => {this.widgetPermission = 'none'});
  }


}
