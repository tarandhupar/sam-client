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

  featureData:any = [
    [
      {
        title:"Search/Display",
        detail:"Benefits.gov Learning Center: ",
        link:"View Benefits.gov",
        url:"http://www.Benefits.gov",
        img:"src/assets/img/placeholder.jpg"
      },
      {
        title:"Reporting",
        detail:"Benefits.gov Learning Center: ",
        link:"View Benefits.gov",
        url:"http://www.Benefits.gov",
        img:"src/assets/img/placeholder.jpg"
      },
      {
        title:"Data Entry",
        detail:"Benefits.gov Learning Center: ",
        link:"View Benefits.gov",
        url:"http://www.Benefits.gov",
        img:"src/assets/img/placeholder.jpg"
      },
    ],
    [
      {
        title:"Administration",
        detail:"Benefits.gov Learning Center: ",
        link:"View Benefits.gov",
        url:"http://www.Benefits.gov",
        img:"src/assets/img/placeholder.jpg"
      },
      {
        title:"Online Help",
        detail:"Benefits.gov Learning Center: ",
        link:"View Benefits.gov",
        url:"http://www.Benefits.gov",
        img:"src/assets/img/placeholder.jpg"
      },
      {
        title:"APIs",
        detail:"Benefits.gov Learning Center: ",
        link:"View Benefits.gov",
        url:"http://www.Benefits.gov",
        img:"src/assets/img/placeholder.jpg"
      },
    ]
  ];

  legacyData:any = [
    [
      {
        title:"Federal Assistance(CFDA)",
        detail:"Benefits.gov Learning Center: ",
        link:"View Benefits.gov",
        url:"http://www.Benefits.gov",
        img:"src/assets/img/placeholder.jpg"
      },
      {
        title:"Opportunities(FBO)",
        detail:"Benefits.gov Learning Center: ",
        link:"View Benefits.gov",
        url:"http://www.Benefits.gov",
        img:"src/assets/img/placeholder.jpg"
      },
      {
        title:"Awards(FPDS)",
        detail:"Benefits.gov Learning Center: ",
        link:"View Benefits.gov",
        url:"http://www.Benefits.gov",
        img:"src/assets/img/placeholder.jpg"
      },
    ],
    [
      {
        title:"Sub-Awards(eSRS, FSRS)",
        detail:"Benefits.gov Learning Center: ",
        link:"View Benefits.gov",
        url:"http://www.Benefits.gov",
        img:"src/assets/img/placeholder.jpg"
      },
      {
        title:"Past Performance(PPIRS, CPARS, FAPIIS)",
        detail:"Benefits.gov Learning Center: ",
        link:"View Benefits.gov",
        url:"http://www.Benefits.gov",
        img:"src/assets/img/placeholder.jpg"
      },
      {
        title:"Wage Determination(WDOL)",
        detail:"Benefits.gov Learning Center: ",
        link:"View Benefits.gov",
        url:"http://www.Benefits.gov",
        img:"src/assets/img/placeholder.jpg"
      },
    ],
    [
      {
        title:"Entities(SAM.gov)",
        detail:"Benefits.gov Learning Center: ",
        link:"View Benefits.gov",
        url:"http://www.Benefits.gov",
        img:"src/assets/img/placeholder.jpg"
      },
      {
        title:"Exclusions(SAM.gov)",
        detail:"Benefits.gov Learning Center: ",
        link:"View Benefits.gov",
        url:"http://www.Benefits.gov",
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
