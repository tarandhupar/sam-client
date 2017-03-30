import { Input, Output,Component,OnInit, ViewChild } from "@angular/core";
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

  @ViewChild('removeModal') removeModal;
  modalConfig = {
    type:'warning',
    title:'Confirm Removal',
    description:'Are you sure you want to remove this ' + this.mode + '? This will permanently remove the ' + this.mode + ' from the database. The ' + this.mode +  ' is not currently associated to any user.'
  };

  onRemoveConfirm(){
    console.log("remove");
    this.removeModal.closeModal();
  }


  onShowExpireModal(event){
    //console.log(event + "," + this.mode);
    this.modalConfig.description ='Are you sure you want to remove this ' + this.mode + '? This will permanently remove the ' + this.mode + ' from the database. The ' + this.mode +  ' is not currently associated to any user.';
    this.removeModal.openModal();
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
