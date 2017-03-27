import { Input,Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "role-content",
  templateUrl: "./role-maincontent.template.html"
})
export class RoleMainContent implements OnInit{

  constructor(private router: Router, private route: ActivatedRoute){}
  @Input() roleDef;
  @Input() currPath;

  ngOnInit(){

  }

  isRole(){
    if(this.currPath === 'roles')
      return true;
  }

  isObject(){
    if(this.currPath === 'objects')
      return true;
  }
    
}
