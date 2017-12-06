import { Component } from "@angular/core";
import { IBreadcrumb } from "sam-ui-elements/src/ui-kit/types";
import { WageDeterminationService } from "api-kit";

@Component({
    moduleId: __filename,
    templateUrl: 'revised-dba-template.html'
})

export class WageDeterminationRevisedDBAPage{
    
    constructor(
        private wageDeterminationService: WageDeterminationService){
    }

    public data: any;
    public dbaWageDeterminations;
    public toBeRevisdedDate;

    ngOnInit(){
        this.getWDToBeRevised();
    }

    crumbs : Array<IBreadcrumb> = [
        { breadcrumb:'Home', url:'/' },
        { breadcrumb:'Search', url:'/search' },
        { breadcrumb:'DBAs to be revised' }
    ]

    getWDToBeRevised(){
        this.wageDeterminationService.getWageDeterminationToBeRevised().subscribe(
            data => {
                this.data = data;
                this.toBeRevisdedDate = this.data.tobeRevised;
                this.dbaWageDeterminations = this.data['_embedded']['dBAToBeRevisedList'].map(function(obj){
                    return obj.wdNo
                });
            },
            error => {
                console.log('error: ', error);
            }

        )
    }
}