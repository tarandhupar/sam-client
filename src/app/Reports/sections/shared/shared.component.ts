import { Component, NgZone, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http } from '@angular/http';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { IAMService } from 'api-kit';
import { globals } from '../../app/globals';

@Component({
  providers: [ IAMService ],
  templateUrl: './shared.template.html',
})
export class SharedComponent {
    showReport;
    sharedParams;
    url;

    constructor(private route: ActivatedRoute, private router: Router, private zone: NgZone, private api: IAMService,
              private sanitizer: DomSanitizer, private http: Http) {}
 
    ngOnInit() {
        if (this.route.snapshot.url[0].path == 'shared') {
            this.showReport = true;
            let mstrParams = this.route.queryParams.subscribe(
                params => {
                    this.sharedParams = Object.keys(params).map(function(key){ 
                    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]); 
                    }).join('&');
                }
            )
            this.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://microstrategydev.helix.gsa.gov/MicroStrategy/servlet/mstrWeb?'+this.sharedParams);
            // need to change mstrParams to individual
        }
    }
}

