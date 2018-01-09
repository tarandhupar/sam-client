import { Component, OnInit } from "@angular/core";
import { WageDeterminationService } from "api-kit";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "app/role-management/user.service";

@Component({
    templateUrl: 'wd-cba.template.html',
    providers: [
    ]
  })

  export class CbaPage implements OnInit {

    private data: any;
    private referenceNumber: string;
    private stateString: string;
    private countyString: string;
    private cityString: string;
    private zipString: string;
    private user: any;
    private isGovUser: boolean;

    constructor(private wgService: WageDeterminationService, private route: ActivatedRoute, private router: Router, private userService: UserService){
      route.params.subscribe(params => {
        this.referenceNumber = params['referencenumber'];
      });
    }

    ngOnInit(){
      this.wgService.getCBAByReferenceNumber(this.referenceNumber).subscribe(
        data => {
          this.data = data;
      },
      error => {
        console.log('an error has occured with the service call');
      });

      // call userService to find if logged in user
      try{
        this.user = this.userService.getUser();
        if(this.user.isGov)
          this.isGovUser = true;
        else
          this.isGovUser = false;
      }
      catch(e){
        this.isGovUser = false;
      }
    }

    navHandler(navType){
      switch(navType){
        case 'overview':
          this.router.navigate(['wage-determination/cba/' + this.referenceNumber + '/view'], {
            fragment: "overview"
          });
          break;
        case 'agreement':
        this.router.navigate(['wage-determination/cba/' + this.referenceNumber + '/view'], {
          fragment: "agreement"
        });
          break;
      }
    }

  }
