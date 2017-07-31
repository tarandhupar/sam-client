import {Component, OnInit} from "@angular/core";
import {Router, Route, ActivatedRoute, NavigationExtras} from "@angular/router";

@Component({
  selector: 'fh-widget',
  templateUrl: './fh-widget.template.html'
})
export class FHWidgetComponent implements OnInit {


  fhRadioModel: any = '90 day';
  fhRadioConfig = {
    options: [
      {value: '90 day', label: 'Last 90 days', name: 'Last 90 days'},
      {value: 'completed', label: 'Scheduled', name: 'Scheduled'},
    ],
    name: 'radio-component',
    errorMessage: '',
    hint: ''
  };

  searchText = "";
  
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
  }

  
  searchFH(){
    //direct to search fh landing page with search text as query param
    let navigationExtras: NavigationExtras = {
      queryParams: {keyword: this.searchText, status:['allActive']}
    };
    this.router.navigate(["/federal-hierarchy"],navigationExtras);
  }
  
}
