import { Component } from '@angular/core';

@Component({
  providers: [ ],
  templateUrl: './award-data.template.html',
})
export class AwardDataComponent {

  isEdit: boolean = false;

  opportunityConfig: any = {
    splashContent:`Splash Language Lorem Lipsum accusam iudicabit cu.Ad verterem scripserit pro, falli apeirian ad est, vis`,
    subHeader:"Sub Header",
    subContent:`Albucius lobortis ius et, sea debet inimicus ne, nec accusam iudicabit cu. Ad verterem scripserit pro, falli apeirian ad est, visne corpora vivendum. Cu nihil exerci principes vis, et eos doctus malorum`,
  };
  features = ['Search/Display', 'Data Entry'];
  commonTerms = [
    {termName:"Term1", termContent:"Term definition lipsum"},
    {termName:"Term2", termContent:"Term definition lipsum"},
    {termName:"Term3", termContent:"Term definition lipsum"}
  ];

  types = {
    label: 'Types',
    options:   [
      { label: 'Search/Display', value: 'Search/Display', name: 'Search/Display' },
      { label: 'Reporting', value: 'Reporting', name: 'Reporting' },
      { label: 'Data Entry', value: 'Data Entry', name: 'Data Entry' },
      { label: 'Administration', value: 'Administration', name: 'Administration' },
      { label: 'Online Help', value: 'Online Help', name: 'Online Help' },
      { label: "API's", value: "API's", name: "API's" }
    ]
  };

  opportunityPrevConfig: any = this.copyCurRecords(this.opportunityConfig);
  preFeatures = this.copyCurRecords(this.features);
  preCommonTerms = this.copyCurRecords(this.commonTerms);

  constructor() {
    this.updateCopies();
  }

  onEditPageClick(){
    this.isEdit = true;
  }

  onCancelEditPageClick(){
    this.isEdit = false;
    this.rollBackWithCopies();
  }

  onSaveEditPageClick(){
    this.isEdit = false;
    this.updateCopies();
  }

  onParamChanged(){
  }

  onRemoveFeatureClick(featureName){
    let featureIndex = this.features.indexOf(featureName);
    this.features.splice(featureIndex,1);
  }

  onRemoveTermClick(term){
    let termIndex = this.commonTerms.indexOf(term);
    this.commonTerms.splice(termIndex,1);
  }

  onAddTermClick(){

  }

  copyCurRecords(val):any{
    let copy;
    if(Array.isArray(val)){
      copy = val.map( e => {
        if(typeof e === 'object'){
          return Object.assign({}, e);
        }
        return e;
      });
    }else if(typeof val === 'object'){
      copy = Object.assign({}, val);
    }else {
      copy = val;
    }

    return copy;
  }

  updateCopies(){
    this.opportunityPrevConfig = this.copyCurRecords(this.opportunityConfig);
    this.preFeatures = this.copyCurRecords(this.features);
    this.preCommonTerms = this.copyCurRecords(this.commonTerms);
  }

  rollBackWithCopies(){
    this.opportunityConfig = this.copyCurRecords(this.opportunityPrevConfig);
    this.features = this.copyCurRecords(this.preFeatures);
    this.commonTerms = this.copyCurRecords(this.preCommonTerms);
  }
}
