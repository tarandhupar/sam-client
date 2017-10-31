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
    showReport = false;
    sharedParams;
    url;
    isSignedIn = false;
    user;

    constructor(private route: ActivatedRoute, private router: Router, private zone: NgZone, private api: IAMService,
        private sanitizer: DomSanitizer, private http: Http) { }

    ngOnInit() {
        let mstrParams = this.route.queryParams.subscribe(
                params => {
                    this.sharedParams = Object.keys(params).map(function(key) {
                        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
                    }).join('&');
                }
            )
        this.checkSignInUser();
        if (this.isSignedIn) {
            this.showReport = true;
            this.url = this.sanitizer.bypassSecurityTrustResourceUrl(REPORT_MICRO_STRATEGY_URL + this.sharedParams + '&iPlanetDirectoryPro='+Cookies.get('iPlanetDirectoryPro'));
        } else {
            this.router.navigate(['/signin']);
        }
    }

    checkSignInUser() {
        this.isSignedIn = false;
        this.api.iam.checkSession((user) => {
            this.zone.run(() => {
                this.isSignedIn = true;
                this.user = user;
            });
        });
    }
}

