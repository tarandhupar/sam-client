import { Component,Input,OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { SavedSearchService } from '../../../../api-kit/search/saved-search.service';
import { AlertFooterService } from "../../../app-components/alert-footer/alert-footer.service";
import * as Cookies from 'js-cookie';
import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs';

@Component({
  moduleId: __filename,
  selector: '',
  template: '',
})
export class SavedSearchRedirect implements OnInit {
    authToken : string = '';
    savedSearches : any = [];
    savedSearch : any = {};
    key : string = '';
    index : any = [];
    params : any = {};
    showRegionalOffices: boolean = false;

    serviceErrorFooterAlertModel = {
        title: "Error",
        description: "",
        type: "error"
      };


    constructor(private activatedRoute: ActivatedRoute, private router: Router, private service: SavedSearchService, private alertFooterService: AlertFooterService) {}

    ngOnInit(){
        this.authToken = Cookies.get('iPlanetDirectoryPro');
        this.activatedRoute.params.subscribe(
            value => {
                this.key = value.id;
            }
        );
        this.service.getAllSavedSearches({
          Cookie: this.authToken
        }).subscribe(data => {
                this.savedSearches = data._embedded.preferences;
                if(this.savedSearches && this.savedSearches.length > 0 && data && this.key){
                    this.savedSearch = this.savedSearches.find(elem => {
                        return elem.data.key === this.key;
                    });

                    //Update and redirect
                    this.updateSavedSearchStatistics();
                }
            },
            error => {
                this.reportError(error);
            }
        );
    }

    // this calls function to set up ES query params again and re-call the search endpoint with updated params
    searchRedirect() {
        var qsobj = this.setupQS();
        let navigationExtras: NavigationExtras = {
            queryParams: qsobj
        };
        if (this.showRegionalOffices) {
            this.router.navigate(['/search/fal/regionalOffices'], navigationExtras);
        } else {
            this.router.navigate(['/search'], navigationExtras);
        }
    }

    updateSavedSearchStatistics(){
        //Update number of usages
        if(!this.savedSearch.numberOfUsages){
            this.savedSearch.numberOfUsages = 1;
        }else{
            this.savedSearch.numberOfUsages += 1;
        }

        //Update last executed
        let runTime = new Date().getTime();
        this.savedSearch.lastUsageDate = runTime;

        var updateSavedSearch= {
            'title': this.savedSearch.title,
            'data': this.savedSearch.data,
            'lastUsageDate': this.savedSearch.lastUsageDate,
            'numberOfUsages': this.savedSearch.numberOfUsages
        }

        //Send Update call to API
        this.service.updateSavedSearch(this.authToken, this.savedSearch.preferenceId, updateSavedSearch)
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
        if(this.savedSearch.title) {
          qsobj['saved_search'] = this.savedSearch.title;
        }

        //key and value are read in reverse for some reason
        _.forOwn(data.parameters, function(value, key){
            if(key === 'keyword'){
                key = 'keywords';
            }
            qsobj[key] = value;
        });

        return qsobj;
    }

    reportError(error){
        console.error('Error!!', error);
        if (error && error.status === 404) {
          this.router.navigate(['404']);
        } else if (error && error.status === 401) {
          this.router.navigate(['403']);
        }
    }


}
