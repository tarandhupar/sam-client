import { Component,Input,OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { SavedSearchService } from '../../../../api-kit/search/saved-search.service';
import { AlertFooterService } from "../../../app-components/alert-footer/alert-footer.service";
import * as Cookies from 'js-cookie';
import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs';
import * as moment from 'moment/moment';

@Component({
  moduleId: __filename,
  selector: '',
  template: '',
})
export class SavedSearchRedirect implements OnInit {
    authToken : string = '';
    preferenceId: string;
    savedSearch : any = {};

    serviceErrorFooterAlertModel = {
        title: "Error",
        description: "",
        type: "error"
      };


    constructor(private activatedRoute: ActivatedRoute, private router: Router, private service: SavedSearchService, private alertFooterService: AlertFooterService) {}

    ngOnInit() {
        this.authToken = Cookies.get('iPlanetDirectoryPro');
        this.activatedRoute.params.subscribe(value => {
          this.preferenceId = value.id;
        });
        this.service.getSavedSearch(this.authToken, this.preferenceId).subscribe(data => {
          this.savedSearch = data;
          //Update and redirect
          this.updateSavedSearchStatistics();
        },
        error => {
          this.reportError(error);
        });
    }

    // this calls function to set up ES query params again and re-call the search endpoint with updated params
    searchRedirect() {
        var qsobj = this.setupQS();
        let navigationExtras: NavigationExtras = {
            queryParams: qsobj
        };
      this.router.navigate(['/search'], navigationExtras);
    }

    updateSavedSearchStatistics(){

        //Make API call to update usage
        this.service.updateSavedSearchUsage(this.authToken, this.preferenceId)
        .subscribe(
            data => {
                this.searchRedirect();
            },
            error => {
                this.reportError(error);
            }
        );
    }

    setupQS(){
        var qsobj = {};
        var data = this.savedSearch.data;

        if(data.index && data.index[0].length > 0){
            qsobj['index'] = data.index[0];
        }else{
            qsobj['index'] = '';
        }
        if(this.savedSearch.preferenceId) {
          qsobj['preference_id'] = this.savedSearch.preferenceId;
        }

        //key and value are read in reverse for some reason
        _.forOwn(data.parameters, function(value, key){
            qsobj[key] = value;
        });

        return qsobj;
    }

    reportError(error){
        console.error('Error!!', error);
        if (error && error.status === 404) {
          this.router.navigate(['404']);
        } else if (error && error.status === 401) {
          this.router.navigate(['401']);
        }
    }

}
