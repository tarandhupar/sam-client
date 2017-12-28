import {Component, Input, Output, OnInit, OnChanges, ViewChild, EventEmitter} from '@angular/core';
import 'rxjs/add/operator/map';
import {FilterParamLabel} from "../../pipes/filter-label.pipe";
import { globals } from '../../.././globals.ts';
import {SavedSearchService} from "../../../../api-kit/search/saved-search.service";
import * as Cookies from 'js-cookie';
import {AlertFooterService} from "../../../app-components/alert-footer/alert-footer.service";
import {Router} from "@angular/router";
import { DatePipe } from '@angular/common'

@Component({
  moduleId: __filename,
  selector: 'saved-search-result',
  templateUrl: 'saved-search-result.template.html',
  providers: [DatePipe]
})
export class SavedSearchResult implements OnInit {
  @ViewChild('modal1') modal1;
  @Input() data: any={};
  @Input() qParams: any={};
  @Output() actionPerformed = new EventEmitter();
  domain: string;
  parameters: any[] =[];
  id: string;
  cookieValue: string;
  savedSearch: any={};
  action: string;
  actionsCallback = () => {
  };
  actions: Array<any> = [
    { name: 'edit', label: 'Edit Name', icon: 'fa fa-pencil-square-o', callback: this.actionsCallback },
    { name: 'duplicate', label: 'Duplicate', icon: 'fa fa-files-o', callback: this.actionsCallback },
    { name: 'delete', label: 'Delete', icon: 'fa fa-trash-o', callback: this.actionsCallback }
  ];
  newSearchName: string = '';
  textConfig = {
    label: "Search Name",
    errorMessage: '',
    name: 'saved search',
    disabled: false,
  };
  successFooterAlertModel = {
    title: "Success",
    description: "",
    type: "success",
    timer: 3000
  };
  getSavedSub: any;

  constructor(private router: Router, private savedSearchService: SavedSearchService, private alertFooterService: AlertFooterService) { }

  ngOnChanges(changes) {
  }

  ngOnInit(){
    let ctx = this;
    if(this.data.preferenceId) {
      this.id = this.data.preferenceId;
    }
    if(this.data.data && this.data.data.parameters) {
      this.getFilterParamLabels(this.data.data.parameters);
    }
    if(this.data.data && this.data.data.index) {
      globals.searchFilterConfig.forEach(function(index) {
        if(index['value'] == ctx.data.data.index.toString()) {
          ctx.domain = index['label'];
        }
      })
    }
  }

  ngOnDestroy() {
    if (this.getSavedSub) {
      this.getSavedSub.unsubscribe();
    }
  }

  //To display parameter labels generically
  getFilterParamLabels(params: any) {
    for (var key in params) {
      if (params.hasOwnProperty(key)) {
        var label = new FilterParamLabel().transform(key, params['date_filter_index']);
        if(key === 'date_filter_index'){
          // don't add
        }else{
          this.parameters.push({"label": label, "value": params[key].toString()});
        }
        
      }
    }
  }

  handleAction(event) {
    this.action = event.name;
    if(event.name === 'duplicate' || event.name === 'delete') {
      this.newSearchName = this.data.title;
    }
    this.modal1.openModal();
  }

  onModalClose(event) {
    this.newSearchName = '';
    this.textConfig.errorMessage = '';
  }

  performAction(event) {
    this.cookieValue = Cookies.get('iPlanetDirectoryPro');
    if(this.action == 'delete') {
      this.deleteSavedSearch();
    } else if(this.newSearchName != '' && this.newSearchName != this.data.title) {
        this.getSavedSub = this.savedSearchService.getSavedSearch(this.cookieValue, this.data.preferenceId).subscribe(data => {
          this.savedSearch['title'] = this.newSearchName;
          this.savedSearch['data'] = data['data'];
          this.savedSearch['data']['key'] = this.newSearchName.toLowerCase().replace(/ /g, "-");
          if (this.action == "edit") {
            this.savedSearch['lastUsageDate'] = data['lastUsageDate'];
            this.savedSearch['numberOfUsages'] = data['numberOfUsages'];
            this.updateSavedSearch();
          } else if (this.action == "duplicate") {
            this.duplicateSavedSearch();
          }
        }, error => {
          this.reportError(error);
        });
    } else {
      this.textConfig.errorMessage = this.newSearchName=='' ? 'Please provide a name' : 'Please provide a new saved search name';
    }
  }

  updateSavedSearch() {
    this.savedSearchService.updateSavedSearch(this.cookieValue, this.data.preferenceId, this.savedSearch).subscribe(res => {
      this.successFooterAlertModel.description = 'Updated successfully.';
      this.modal1.closeModal();
      this.actionPerformed.emit();
      this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.successFooterAlertModel)));
    }, error => {
      this.reportError(error.json());
    });
  }

  duplicateSavedSearch() {
    this.savedSearchService.createSavedSearch(this.cookieValue, this.savedSearch).subscribe(res => {
      this.successFooterAlertModel.description = 'Saved successfully.';
      this.modal1.closeModal();
      this.actionPerformed.emit();
      this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.successFooterAlertModel)));
    }, error => {
      this.reportError(error.json());
    });

  }

  deleteSavedSearch() {
    this.savedSearchService.deleteSavedSearch(this.cookieValue, this.data.preferenceId).subscribe(res => {
      this.successFooterAlertModel.description = 'Deleted successfully.';
      this.modal1.closeModal();
      this.actionPerformed.emit();
      this.alertFooterService.registerFooterAlert(JSON.parse(JSON.stringify(this.successFooterAlertModel)));
    }, error => {
      this.reportError(error.json());
    });
  }

  reportError(error){
    console.error('Error performing actions!!', error);
    if (error && error.status === 400 && error.message.indexOf(":")>-1) {
      this.textConfig.errorMessage = error.message.split(":")[1];
    } else if (error && error.status === 401) {
      this.router.navigate(['401']);
    } else if (error && error.status === 404) {
      this.router.navigate(['404']);
    }
  }

}
