import { Component, NgZone, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Http } from '@angular/http';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { IAMService } from 'api-kit';
import { globals } from '../../app/globals';
import * as Cookies from 'js-cookie';

@Component({
    providers: [IAMService],
    templateUrl: './shared.template.html',
})
export class SharedComponent {
    showReport: boolean = false;
    sharedParams: string;
    redirect: object;
    url: SafeResourceUrl;
    isSignedIn: boolean = false;
    user: object;

    constructor(private route: ActivatedRoute, private router: Router, private zone: NgZone, private api: IAMService,
        private sanitizer: DomSanitizer, private http: Http) {}

    ngOnInit() {
        this.checkSession();
    }

    prepareRedirect() {
        this.route.queryParams.subscribe(
            params => {
                let redirect = {};
                Object.assign(redirect, params, {redirect: '/reports/shared/mstrWeb'});
                this.redirect = redirect;
            },
            (err) => console.error(err)
        );
    }

    getParametersForUrl() {
        this.route.queryParams.subscribe(
            params => {
                this.sharedParams = Object.keys(params).map(function(key) {
                        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
                    }).join('&');
            },
            (err) => console.error(err)
        );
    }

    checkSession() {
        this.api.iam.checkSession(user => {
            this.isSignedIn = true;
            this.user = user;
            this.showReport = true;
            this.getParametersForUrl();
            this.url = this.sanitizer.bypassSecurityTrustResourceUrl(REPORT_MICRO_STRATEGY_URL + this.sharedParams + '&iPlanetDirectoryPro='+Cookies.get('iPlanetDirectoryPro'));
          }, () => {
            this.isSignedIn = false;
            this.user = null;
            this.prepareRedirect();
            this.router.navigate(['/signin'], {
                queryParams: this.redirect
            });
          });
    }
}

