import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { bootstrap } from '@angular/platform/browser';
@Component({
  providers: [ ],
  templateUrl: './static.template.html',
  
})
export class StaticComponent {

  data: Object;
  totalReportCount: number = 0;
    constructor(private http: Http) {
      http.get('assets/staticReports.json')
        .map(res => res.json())
        .subscribe(data => this.data = data,
                    err => console.log(err),
                    () => console.log('Completed'));
	

    }

}
