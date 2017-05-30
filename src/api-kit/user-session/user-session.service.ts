import { Injectable, NgZone } from '@angular/core';
import { WrapperService } from '../wrapper/wrapper.service';
import { IAMService } from '../iam/iam.service';
import { Observable, Subscription } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';

@Injectable()
export class UserSessionService {
  idleTime = Number.parseInt(IDLE_TIME);
  pingInterval = Number.parseInt(PINGER_TIME)*60;
  timeoutDuration = Number.parseInt(TIMEOUT_DURATION)*60;

  idleState = 'Not started';
  pingState = 'Not started';
  timedOut = false;
  isIdle = false;

  onTimeout: Subscription;
  onInterrupt: Subscription;
  onIdleStart: Subscription;

  pingIndex = 0;

  pinger;
  constructor(private _router: Router,
              private activatedRoute: ActivatedRoute,
              private idle: Idle,
              private keepalive: Keepalive,
              private iamService: IAMService,
              private zone: NgZone) {
  }

  idleDetectionStart(sessionModalCB:()=>any){

    this.clearIntervals();
    // sets an idle timeout of 12 min
    this.idle.setIdle(this.idleTime);
    // sets a timeout period of 12 min. after 2 min of inactivity, the user will be considered timed out.
    this.idle.setTimeout(this.timeoutDuration);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);


    this.onTimeout = this.idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      // Make API call to log out the user and redirect them back to home page
      this.logoutUserSession();
      this._router.navigateByUrl('/');
      this.idleDetectionStop();

    });
    this.onIdleStart = this.idle.onIdleStart.subscribe(() => {
      this.idleState = 'Gone idle!';
      this.isIdle = true;
      sessionModalCB();
    });
    this.onInterrupt = this.idle.onInterrupt.subscribe(() => {
      // Reset idle time
      this.idle.setIdle(this.idleTime);
      this.idleState = 'Count down from start again!';
    });



    this.pinger = setInterval(() => {
      this.pingIndex ++;

      if(this.isIdle){
        // Make API call to log out the user and redirect them back to home page
        // this.logoutUserSession();
        this._router.navigateByUrl('/signout');
        this.pingState = "Log out";
        this.idleDetectionStop();

      }else{
        // Make API call to extend user session
        this.extendUserSession();

        this.pingState = "Extend session";

      }
    }, this.pingInterval*1000);

    this.reset();


  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started';
    this.pingState = 'Started';
    this.timedOut = false;
    this.isIdle = false;
    this.pingIndex = 0;
  }

  idleDetectionStop(){
    this.idle.stop();
    this.timedOut = false;
    this.isIdle = false;
    this.clearIntervals();
    this.pingIndex = 0;
    this.onTimeout.unsubscribe();
    this.onIdleStart.unsubscribe();
    this.onInterrupt.unsubscribe();
  }

  clearIntervals(){
    clearInterval(this.pinger);
  }

  extendUserSession(){
    this.iamService.iam.checkSession((user) => {
      this.zone.run(() => {});
    });
  }

  logoutUserSession(){
    this.iamService.iam.logout(false);
  }

}
