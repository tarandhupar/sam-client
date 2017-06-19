import { Component } from "@angular/core";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { AACRequestService } from 'api-kit/aac-request/aac-request.service.ts';

@Component ({
  templateUrl: 'move-org.template.html'
})
export class OrgMovePage {

  constructor(private route: ActivatedRoute){}

  ngOnInit(){
    
  }

}
