import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Report } from './report';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class ReportService {

    private _reports;
    private dataStore: {
        reports: Report[]
    }
    
    private handleError(error: any): Promise<any> {
        console.error('An error occured', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    constructor(private http: Http) { 
        this.loadReports();
        this.dataStore = { reports: [] }
        this._reports;
     }

    loadReports() {
        this.http.get('src/assets/dynamicMincReports.json')
            .map(res => res.json())
            .subscribe(reports => {
                this._reports = reports;
            },
            err => console.log(err),
            () => console.log('complete'));
    }
    get reports() {
        return this._reports;
    }

}
