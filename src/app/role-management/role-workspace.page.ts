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
    /*this.Data.forEach(dom => {
      if(dom.hasOwnProperty('roleDefinitionMapContent')){
        dom.roleDefinitionMapContent.forEach( rol => {
          rol.flag = false;
        });
        console.log(dom.roleDefinitionMapContent);
      }
    });*/
  }

  getDefinition(){
    if(this.path === 'roles')
      this.mode = 'role';
    else
      this.mode = 'object';

    this.role.getRoleObjDefinitions(this.mode,this.domainKey).subscribe(res => {
      console.log(res);
      this.Data = res;
    });
  }

  onPathChange(event){
    this.path = event;
    this.getDefinition();
  }
  onSelectedChange(event){
    console.log(event);
    this.domainKey = event;
    this.getDefinition();
  }
  /*Data = [
   {
      "domain":{
         "id":1,
         "val":"AWARD"
      },
      "roleDefinitionMapContent":[
         {
            "role":{
               "id":1,
               "val":"GENERAL PUBLIC"
            },
            "functionContent":[
               {
                  "function":{
                     "id":1,
                     "val":"EXECUTIVE REPORTS"
                  },
                  "permission":[
                     {
                        "id":2,
                        "val":"SEND"
                     },
                     {
                        "id":1,
                        "val":"GET"
                     }
                  ]
               },
               {
                  "function":{
                     "id":2,
                     "val":"PUBLIC REPORTS"
                  },
                  "permission":[
                     {
                        "id":2,
                        "val":"SEND"
                     },
                     {
                        "id":1,
                        "val":"GET"
                     }
                  ]
               }
            ]
         },
         {
            "role":{
               "id":2,
               "val":"CONTRACTING SPECIALIST"
            },
            "functionContent":[
               {
                  "function":{
                     "id":3,
                     "val":"IDV"
                  },
                  "permission":[
                     {
                        "id":8,
                        "val":"VALIDATE"
                     },
                     {
                        "id":7,
                        "val":"UPDATE"
                     },
                     {
                        "id":6,
                        "val":"MODIFY"
                     },
                     {
                        "id":5,
                        "val":"ISCOMPLETE"
                     },
                     {
                        "id":4,
                        "val":"DELETE DRAFT"
                     },
                     {
                        "id":3,
                        "val":"CREATE"
                     }
                  ]
               },
               {
                  "function":{
                     "id":4,
                     "val":"AWARD"
                  },
                  "permission":[
                     {
                        "id":8,
                        "val":"VALIDATE"
                     },
                     {
                        "id":7,
                        "val":"UPDATE"
                     },
                     {
                        "id":6,
                        "val":"MODIFY"
                     },
                     {
                        "id":5,
                        "val":"ISCOMPLETE"
                     },
                     {
                        "id":4,
                        "val":"DELETE DRAFT"
                     },
                     {
                        "id":3,
                        "val":"CREATE"
                     }
                  ]
               }
            ]
         },
         {
            "role":{
               "id":3,
               "val":"CONTRACTING OFFICER/SPECIALIST"
            },
            "functionContent":[
               {
                  "function":{
                     "id":2,
                     "val":"PUBLIC REPORTS"
                  },
                  "permission":[
                     {
                        "id":2,
                        "val":"SEND"
                     },
                     {
                        "id":9,
                        "val":"SCHEDULE"
                     },
                     {
                        "id":1,
                        "val":"GET"
                     }
                  ]
               },
               {
                  "function":{
                     "id":3,
                     "val":"IDV"
                  },
                  "permission":[
                     {
                        "id":14,
                        "val":"DELETE"
                     },
                     {
                        "id":8,
                        "val":"VALIDATE"
                     },
                     {
                        "id":7,
                        "val":"UPDATE"
                     },
                     {
                        "id":6,
                        "val":"MODIFY"
                     },
                     {
                        "id":5,
                        "val":"ISCOMPLETE"
                     },
                     {
                        "id":3,
                        "val":"CREATE"
                     },
                     {
                        "id":13,
                        "val":"APPROVE"
                     },
                     {
                        "id":10,
                        "val":"CORRECT"
                     }
                  ]
               },
               {
                  "function":{
                     "id":4,
                     "val":"AWARD"
                  },
                  "permission":[
                     {
                        "id":8,
                        "val":"VALIDATE"
                     },
                     {
                        "id":7,
                        "val":"UPDATE"
                     },
                     {
                        "id":6,
                        "val":"MODIFY"
                     },
                     {
                        "id":5,
                        "val":"ISCOMPLETE"
                     },
                     {
                        "id":14,
                        "val":"DELETE"
                     },
                     {
                        "id":3,
                        "val":"CREATE"
                     },
                     {
                        "id":10,
                        "val":"CORRECT"
                     },
                     {
                        "id":13,
                        "val":"APPROVE"
                     }
                  ]
               },
               {
                  "function":{
                     "id":5,
                     "val":"GOVERNMENT REPORTS"
                  },
                  "permission":[
                     {
                        "id":2,
                        "val":"SEND"
                     },
                     {
                        "id":9,
                        "val":"SCHEDULE"
                     },
                     {
                        "id":1,
                        "val":"GET"
                     }
                  ]
               },
               {
                  "function":{
                     "id":6,
                     "val":"WEBPORTAL"
                  },
                  "permission":[
                     {
                        "id":18,
                        "val":"SEARCH/VIEW CONTRACTS"
                     },
                     {
                        "id":17,
                        "val":"REPORTS"
                     },
                     {
                        "id":16,
                        "val":"REFERENCE DATA MAINTENANCE"
                     },
                     {
                        "id":15,
                        "val":"DATA COLLECTION"
                     },
                     {
                        "id":11,
                        "val":"USER MAINTENANCE"
                     }
                  ]
               },
               {
                  "function":{
                     "id":7,
                     "val":"ADHOC REPORTS"
                  },
                  "permission":[
                     {
                        "id":12,
                        "val":"VIEW"
                     }
                  ]
               }
            ]
         }
      ],
      "functionMapContent":[
         {
            "function":{
               "id":1,
               "val":"EXECUTIVE REPORTS"
            },
            "permission":[
               {
                  "id":1,
                  "val":"GET"
               },
               {
                  "id":2,
                  "val":"SEND"
               }
            ]
         },
         {
            "function":{
               "id":2,
               "val":"PUBLIC REPORTS"
            },
            "permission":[
               {
                  "id":1,
                  "val":"GET"
               },
               {
                  "id":2,
                  "val":"SEND"
               },
               {
                  "id":9,
                  "val":"SCHEDULE"
               }
            ]
         },
         {
            "function":{
               "id":3,
               "val":"IDV"
            },
            "permission":[
               {
                  "id":3,
                  "val":"CREATE"
               },
               {
                  "id":4,
                  "val":"DELETE DRAFT"
               },
               {
                  "id":5,
                  "val":"ISCOMPLETE"
               },
               {
                  "id":6,
                  "val":"MODIFY"
               },
               {
                  "id":7,
                  "val":"UPDATE"
               },
               {
                  "id":8,
                  "val":"VALIDATE"
               },
               {
                  "id":10,
                  "val":"CORRECT"
               },
               {
                  "id":13,
                  "val":"APPROVE"
               },
               {
                  "id":14,
                  "val":"DELETE"
               }
            ]
         },
         {
            "function":{
               "id":4,
               "val":"AWARD"
            },
            "permission":[
               {
                  "id":3,
                  "val":"CREATE"
               },
               {
                  "id":4,
                  "val":"DELETE DRAFT"
               },
               {
                  "id":5,
                  "val":"ISCOMPLETE"
               },
               {
                  "id":6,
                  "val":"MODIFY"
               },
               {
                  "id":7,
                  "val":"UPDATE"
               },
               {
                  "id":8,
                  "val":"VALIDATE"
               },
               {
                  "id":13,
                  "val":"APPROVE"
               },
               {
                  "id":10,
                  "val":"CORRECT"
               },
               {
                  "id":14,
                  "val":"DELETE"
               }
            ]
         },
         {
            "function":{
               "id":5,
               "val":"GOVERNMENT REPORTS"
            },
            "permission":[
               {
                  "id":1,
                  "val":"GET"
               },
               {
                  "id":9,
                  "val":"SCHEDULE"
               },
               {
                  "id":2,
                  "val":"SEND"
               }
            ]
         },
         {
            "function":{
               "id":6,
               "val":"WEBPORTAL"
            },
            "permission":[
               {
                  "id":11,
                  "val":"USER MAINTENANCE"
               },
               {
                  "id":15,
                  "val":"DATA COLLECTION"
               },
               {
                  "id":16,
                  "val":"REFERENCE DATA MAINTENANCE"
               },
               {
                  "id":17,
                  "val":"REPORTS"
               },
               {
                  "id":18,
                  "val":"SEARCH/VIEW CONTRACTS"
               }
            ]
         },
         {
            "function":{
               "id":7,
               "val":"ADHOC REPORTS"
            },
            "permission":[
               {
                  "id":12,
                  "val":"VIEW"
               }
            ]
         }
      ]
   },
   {
      "domain":{
         "id":2,
         "val":"OPPORTUNITY"
      },
      "functionMapContent":[

      ]
   }
];*/
}
