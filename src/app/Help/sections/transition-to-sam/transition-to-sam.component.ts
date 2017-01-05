import { Component } from '@angular/core';

@Component({
  providers: [ ],
  templateUrl: './transition-to-sam.template.html',
})
export class TransitionToSamComponent {

  releaseData:any = [
    {releaseNum:3,releaseDate:"Sept 2015",releaseFeature:["CFDA"]},
    {releaseNum:4,releaseDate:"Dec 2015",releaseFeature:["FBO"]},
    {releaseNum:5,releaseDate:"Apr 2016",releaseFeature:["eSRS"]},
    {releaseNum:6,releaseDate:"Jul 2016",releaseFeature:["FPDS","FAPIIS"]},
    {releaseNum:7,releaseDate:"Oct 2016",releaseFeature:["WDOL"]},
    {releaseNum:8,releaseDate:"Feb 2017",releaseFeature:["CPARS"]},
  ];

  featureReleaseDetail:any = {
    preRelease:{releaseNum:6, releaseDate:"May 1st, 2016",
      releaseDetail:[{featureName:"FPDS",description:"Lorem ipsum dolora"},
                      {featureName:"CFDA",description:"Consesctur odipsing"}]},
    curRelease:{releaseNum:7, releaseDate:"October 15th, 2016",
      releaseDetail:[{featureName:"FPDS",description:"Lorem ipsum dolor"},
                      {featureName:"CFDA",description:"Consesctur odipsing"},
                      {featureName:"eSRS",description:"Lipsum lorem"}]},
    nextRelease:{releaseNum:8, releaseDate:"February 1st, 2017",
      releaseDetail:[{featureName:"FPDS",description:"Lorem ipsum dolor"},
                      {featureName:"CFDA",description:"Consesctur odipsing"},
                      {featureName:"eSRS",description:"Lipsum lorem"}]}
  };

  featureData:any = [
    [
      {
        title:"Search/Display",
        releaseDetail: this.featureReleaseDetail,
        link:"View Search/Display",
        url:"fakeUrl",
        img:"src/assets/img/placeholder.jpg"
      },
      {
        title:"Reporting",
        releaseDetail: this.featureReleaseDetail,
        link:"View Reporting",
        url:"fakeUrl",
        img:"src/assets/img/placeholder.jpg"
      },
      {
        title:"Data Entry",
        releaseDetail: this.featureReleaseDetail,
        link:"View Data Entry",
        url:"fakeUrl",
        img:"src/assets/img/placeholder.jpg"
      },
    ],
    [
      {
        title:"Administration",
        releaseDetail: this.featureReleaseDetail,
        link:"View Administration",
        url:"fakeUrl",
        img:"src/assets/img/placeholder.jpg"
      },
      {
        title:"Online Help",
        releaseDetail: this.featureReleaseDetail,
        link:"View Online Help",
        url:"/help",
        img:"src/assets/img/placeholder.jpg"
      },
      {
        title:"APIs",
        releaseDetail: this.featureReleaseDetail,
        link:"View APIs",
        url:"fakeUrl",
        img:"src/assets/img/placeholder.jpg"
      },
    ]
  ];

  legacyData:any = [
    [
      {
        title:"Federal Assistance(CFDA)",
        releaseDetail: this.featureReleaseDetail,
        link:"View CFDA",
        url:"fakeUrl",
        img:"src/assets/img/placeholder.jpg"
      },
      {
        title:"Opportunities(FBO)",
        releaseDetail: this.featureReleaseDetail,
        link:"View FBO",
        url:"fakeUrl",
        img:"src/assets/img/placeholder.jpg"
      },
      {
        title:"Awards(FPDS)",
        releaseDetail: this.featureReleaseDetail,
        link:"View FPDS",
        url:"fakeUrl",
        img:"src/assets/img/placeholder.jpg"
      },
    ],
    [
      {
        title:"Sub-Awards(eSRS, FSRS)",
        releaseDetail: this.featureReleaseDetail,
        link:"View Sub Awards",
        url:"fakeUrl",
        img:"src/assets/img/placeholder.jpg"
      },
      {
        title:"Past Performance(PPIRS, CPARS, FAPIIS)",
        releaseDetail: this.featureReleaseDetail,
        link:"View Performance",
        url:"fakeUrl",
        img:"src/assets/img/placeholder.jpg"
      },
      {
        title:"Wage Determination(WDOL)",
        releaseDetail: this.featureReleaseDetail,
        link:"View WDOL",
        url:"fakeUrl",
        img:"src/assets/img/placeholder.jpg"
      },
    ],
    [
      {
        title:"Entities(SAM.gov)",
        releaseDetail: this.featureReleaseDetail,
        link:"View Entities",
        url:"fakeUrl",
        img:"src/assets/img/placeholder.jpg"
      },
      {
        title:"Exclusions(SAM.gov)",
        releaseDetail: this.featureReleaseDetail,
        link:"View Exclusions",
        url:"fakeUrl",
        img:"src/assets/img/placeholder.jpg"
      }
    ]
  ];

  filter:string = "feature";

  constructor() { }

  getVerticalLineLength():number{
    return Math.max.apply(Math, this.releaseData.map(function(item){return item.releaseFeature.length;}));
  }

  getVerticalRangeArray():any{
    return Array.from(Array(this.getVerticalLineLength()).keys());
  }

  getColorClass(type):string{
    if(this.filter === type){
      return "transition-filter-selected";
    }
    return "";
  }

  selectFilter(type){
    this.filter = type;
  }

  isCurrentFilter(type){
    return this.filter === type;
  }
  
}
