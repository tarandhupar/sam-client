import { Input, Output,Component,OnInit } from "@angular/core";
import { UserAccessService } from "../../api-kit/access/access.service";


@Component({
  providers: [ UserAccessService ],
  templateUrl: 'role-workspace.page.html'
})
export class RoleWorkspacePage implements OnInit {
  path: 'roles' | 'objects' = 'roles' ;
  mode: 'role' | 'object' = 'role';
  domainKey = '';
  Data : any;

  constructor(private role: UserAccessService){

  }
  ngOnInit(){
      this.getDefinition();
  }

  getDefinition(){
    if(this.path === 'roles')
      this.mode = 'role';
    else
      this.mode = 'object';

    this.role.getRoleObjDefinitions(this.mode,this.domainKey).subscribe(res => {
      this.Data = res;
    });
  }

  onPathChange(event){
    this.path = event;
    this.getDefinition();
  }
  onSelectedChange(event){
    this.domainKey = event;
    this.getDefinition();
  }  
}
