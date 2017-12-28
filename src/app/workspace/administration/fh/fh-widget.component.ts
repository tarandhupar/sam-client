import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras} from '@angular/router';
import { FHService } from 'api-kit/fh/fh.service';
import { FHAdminType, FhWidgetService } from './fh-widget.service';

@Component({
  selector: 'fh-widget',
  templateUrl: './fh-widget.template.html'
})
export class FHWidgetComponent implements OnInit {

  fhRadioModel: any = 'recent';
  fhRadioConfig = {
    options: [
      {value: 'recent', label: 'Last 90 days', name: 'Last 90 days'},
      {value: 'scheduled', label: 'Scheduled', name: 'Scheduled'},
    ],
    name: 'radio-component',
    errorMessage: '',
    hint: ''
  };

  searchText = '';
  createdTotal = 0;
  expiredTotal = 0;

  widgetPermission = 'none';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fhService: FHService,
    private fhWidgetService: FhWidgetService,
  ) {

  }

  ngOnInit() {
    this.fhWidgetService.fetchRecent().subscribe(res => {
      this.updatePermissions(res);
      this.updateCounts(res);
    });
  }

  updatePermissions(res) {
    const adminType: FHAdminType = this.fhWidgetService.getAdminType(res);
    switch (adminType) {
      case FHAdminType.NonAdmin:
        this.widgetPermission = 'none';
        break;
      case FHAdminType.OfficeAdmin:
        this.widgetPermission = 'partial';
        break;
      case FHAdminType.SuperAdmin:
        this.widgetPermission = 'all';
        break;
      default:
        console.error('Unexpected admin type');
    }
  }

  searchFH() {
    // direct to search fh landing page with search text as query param
    let navigationExtras: NavigationExtras = {
      queryParams: {
        keyword: this.searchText,
        status: ['allActive'],
      }
    };
    this.router.navigate(['/federal-hierarchy'], navigationExtras);
  }

  fetchCounts() {
    if (this.fhRadioModel === 'recent') {
      this.fhWidgetService.fetchRecent().subscribe(res => {
        this.updatePermissions(res);
        this.updateCounts(res);
      });
    } else if (this.fhRadioModel === '') {
      this.fhWidgetService.fetchScheduled().subscribe(res => {
        this.updatePermissions(res);
        this.updateCounts(res);
      });
    }
  }

  updateCounts(data) {
    if (Object.keys(data['_links']).length > 1) {
      this.createdTotal = data['startCount'];
      this.expiredTotal = data['endCount'];
    }
  }


}
