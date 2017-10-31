import {Component, ViewChild} from '@angular/core';
import * as Cookies from 'js-cookie';
import {OpportunityService} from '../../../../api-kit/opportunity/opportunity.service';
import * as _ from 'lodash';

@Component({
    selector: 'opp-widget',
    templateUrl: './opp-widget.template.html'
})
export class OppWidgetComponent {
    @ViewChild('pieChart') pieChart;

    permissions: any = {};
    cookieValue: string;
    oppCounts: any = {};
    chartCounts: any = {};

    oppFacets: any = ['status', 'status_active'];
  
    constructor(private opportunityService: OpportunityService) {}

    ngOnInit(){
        this.cookieValue = Cookies.get('iPlanetDirectoryPro');
        if(this.cookieValue){
            this.opportunityService.getPermissions(this.cookieValue).subscribe(res => {
                this.permissions = res;
            },
            error => {
                console.log("Error getting permissions", error);
            });
            this.loadOppCounts();
        }
    }

    isEmpty(obj: any){
        return _.isEmpty(obj);
    }

    loadOppCounts(){
        this.opportunityService.runOpportunity({
            facets: this.oppFacets.toString(),
            Cookie: this.cookieValue,
        }).subscribe(data => {
            if(data._embedded && data._embedded.facets) {
                for(var facet of data._embedded.facets) {
                    if(facet['name']){
                        switch(facet['name']) {
                            case 'status':
                                if(facet['buckets']){
                                    this.setOppCounts(facet['buckets']);                                    
                                }
                                break;
                            case 'status_active':
                                if(facet['buckets']){
                                    this.setChartCounts(facet['buckets']);                                
                                }
                                break;
                        }
                    }
                }
              }
        },
        error => {
            console.error("Error getting opportunity counts", error);
        })
    }

    setChartCounts(buckets){
        for(var bucket in buckets){
            switch(buckets[bucket]['name']){
                case 'total_active':
                    this.chartCounts.active = buckets[bucket]['count'];
                    break;
                case 'active_deadline_within_week':
                    this.chartCounts.within_week = buckets[bucket]['count'];
                    break;
                case 'active_deadline_outside_week':
                    this.chartCounts.outside_week = buckets[bucket]['count'];
                    break;
            }
        }
        if(this.oppCounts.archived){
            this.chartCounts.archived = this.oppCounts.archived;            
        }
        if(this.pieChart){
            this.pieChart.updateChart();
        }
    }
    setOppCounts(buckets){
        for(var bucket in buckets){
            switch(buckets[bucket]['name']){
                case 'total_active':
                    this.oppCounts.active = buckets[bucket]['count'];
                    break;
                case 'total_draft':
                    this.oppCounts.draft = buckets[bucket]['count'];
                    break;
                case 'total_archived':
                    this.oppCounts.archived = buckets[bucket]['count'];
                    break;
            }
        }
    }





}