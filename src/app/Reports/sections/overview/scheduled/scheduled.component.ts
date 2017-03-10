import { Component, NgZone, NgModule  } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { IAMService } from 'api-kit';
import { globals } from '../../app/globals.ts';


@Component({
  providers: [IAMService],
  templateUrl: './scheduled.template.html',

})
export class ScheduledComponent {
public id = null;
public name = null;
public desc = null;
public pwd = null;
url: SafeResourceUrl;
private showReport:boolean = false;
public states = {
    isSignedIn: false
  };

  public user = null;

   constructor(
  private route: ActivatedRoute,
  private router: Router,private zone: NgZone, private api: IAMService, private sanitizer: DomSanitizer
) {
      this.zone.runOutsideAngular(() => {
      this.checkSession(() => {
        this.zone.run(() => {
          // Callback
        });
      });
    });
}


checkSession(cb: () => void) {
    let vm = this;

    this.api.iam.user.get(function(user) {
    vm.states.isSignedIn = true;
    vm.user = user;
    if(user._id == "TEST_Public_User"){
      vm.pwd = "Publictest!!123";
    }
    else if (user._id == "TEST_NASA_User"){
      vm.pwd = "NASA";
    }
    else if (user._id == "TEST_DOD_User"){
      vm.pwd = "DOD";
    }
    else if (user._id == "TEST_Sys_Admin"){
      vm.pwd = "SYSADMIN";
    }
    else if (user._id == "TEST_DOD_Admin"){
      vm.pwd = "abc123";
    }
    else{
      vm.pwd = "abc123";
    }
    vm.url = vm.sanitizer.bypassSecurityTrustResourceUrl("https://csp-microstrategy.sam.gov/MicroStrategy/servlet/mstrWeb?evt=3031&src=mstrWeb.3031&server=10.11.34.63&project=SAM+Prototype&uid="+vm.user._id+"&pwd="+vm.pwd+"&hiddensections=path,dockLeft,footer");
      cb();
    });
  }

ngOnInit() { 
  this.showReport = true; // show iframe
}

}