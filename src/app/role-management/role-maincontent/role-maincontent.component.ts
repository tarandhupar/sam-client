import { Input,Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { CapitalizePipe } from "../../app-pipes/capitalize.pipe";


@Component({
  selector: "role-content",
  templateUrl: "./role-maincontent.template.html",
})
export class RoleMainContent implements OnInit{

  constructor(private router: Router, private route: ActivatedRoute){}
  @Input() roleDef;
  @Input() currPath;

  @Output() onRemoveClick: EventEmitter<any> = new EventEmitter<any>();
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

  clickRemove(func,domain){
    let clickedValues = {function : func, domain : domain};
    this.onRemoveClick.emit(clickedValues);
  }

}
