import { Input, Output,Component,OnInit, ViewChild } from "@angular/core";
import { UserAccessService } from "../../../api-kit/access/access.service";


@Component({
  providers: [ UserAccessService ],
  templateUrl: 'role-definition.page.html'
})
export class RoleDefinitionPage implements OnInit {
  path: 'roles' | 'objects' = 'roles' ;
  mode: 'role' | 'object' = 'role';
  domainKey = '';
  Data : any;

  removefunc : string;
  removedomain : string;

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
    this.role.deleteFunction(this.removedomain,this.removefunc).subscribe(res =>{
        if(this.mode === 'object' && res.status == 200){
          this.Data.forEach(dom => {
            if(dom.domain.id == this.removedomain){
              dom.functionMapContent = dom.functionMapContent.filter(val => { return val.function.id != this.removefunc});
            }
          });
        }
    });

    this.removeModal.closeModal();
  }


  onShowExpireModal(event){
    if(this.mode === 'role')
      this.modalConfig.description ='Are you sure you want to remove this ' + this.mode + '? This will permanently remove the ' + this.mode + ' from the database. The ' + this.mode +  ' is not currently associated to any user.';
    else{
      this.modalConfig.description ='Are you sure you want to remove this ' + this.mode + '? This will permanently remove the ' + this.mode + ' from the database. This ' + this.mode +  ' is not currently associated to any role under this domain.'
      this.removefunc = event.function;
      this.removedomain = event.domain;
    }

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
