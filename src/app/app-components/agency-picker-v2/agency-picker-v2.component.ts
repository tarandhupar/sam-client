import { Component, ChangeDetectorRef, forwardRef, Directive, Input, ElementRef, Renderer, Output, OnInit, EventEmitter, ViewChild, SimpleChanges } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FHService, IAMService } from "api-kit";
import { ControlValueAccessor,NG_VALUE_ACCESSOR,AbstractControl } from '@angular/forms';
import { DpmtSelectConfig, AgencySelectConfig, OfficeSelectConfig } from './configs';
import { LabelWrapper } from "sam-ui-elements/src/ui-kit/wrappers/label-wrapper";
import { FHTitleCasePipe } from "../../app-pipes/fhTitleCase.pipe";
import adminLevel from "app/role-management/admin-level";
import { cloneDeep } from 'lodash';

@Component({
  selector: 'sam-agency-picker-v2',
  templateUrl:'agency-picker-v2.template.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AgencyPickerV2Component),
    multi: true
  },
  FHTitleCasePipe]
})
/**
 * AgencyPickerComponent - Connects to backend FH services to select a single/multiple organizations
 */
export class AgencyPickerV2Component implements OnInit, ControlValueAccessor {
    /**
     * Sets the required text in the label wrapper
     */
    @Input() required: boolean;
    /**
     * Sets the label wrapper text
     */
    @Input() label: string;
    /**
     * Sets the name/id properties with form elements + labels
     */
    @Input() name: string = "default";
    /**
     * Sets the hint text
     */
    @Input() hint: string;
    /**
     * Sets the placeholder text
     */
    @Input() placeholder: string = '';
    /**
     * Sets the form control for checking validations and updating label messages
     */
    @Input() control: AbstractControl;
    /**
     * Sets the autocomplete between the "multiple" or "single" selection types
     */
    @Input() type: string = "multiple";
    /**
     * Sets the organization the picker should lock on (ie. ['100000000'])
     */
    @Input() orgRoots = [];
    /**
     * Sets the number of levels down the picker should go down to
     */
    @Input() limit;
    /**
     * When logged in, sets the orgRoot to the user's organization
     */
    @Input() defaultDept:boolean = false;
    /**
     * Sets the label wrapper error message manually
     */
    @Input() searchMessage: '';
    /**
     * Flag that controls emitting an event when the formControl passes down a new value to set
     */
    @Input() editOnFlag: boolean = true;
    /**
     * Flag that filters results that have FPDS codes
     */
    @Input() hasFpds: boolean = false;

    /**
     * Flag to show/hide inactive offices in advanced dropdown
     */
    @Input() activeOnly: boolean = true;

    orgLimit: number = 7;
    orgLevels: any[] = [];

    private dropdownLimit: number = 200;
    private _disabled: boolean = false;

    labelName: string;
    selections = null;
    orgRootLevel = 0;
    serviceOptions = {};
    singleACConfig = {keyValueConfig:{keyProperty: 'key',valueProperty: 'name'}};
    multipleACConfig = {keyProperty: 'key',valueProperty: 'name'};

    constructor(private oFHService:FHService, private iamService: IAMService, private cdr:ChangeDetectorRef, private fhTitleCasePipe:FHTitleCasePipe) {}

    onChange = (_: any)=>{ console.error('this will only get called if the component fails to register onChange')};
    onTouched = ()=>{};
    showAdvanced = false;
    @ViewChild(LabelWrapper) wrapper: LabelWrapper;
    ngOnChanges(c){
        if(c['orgRoots'] && this.orgRoots && this.orgRoots.length > 0){
            this.reset();
            this.prepareAdvanced();
            this.serviceOptions['parent'] = this.orgRoots[0];
            this.singleACConfig['serviceOptions'] = this.serviceOptions;
        }
        if(c['defaultDept'] && this.defaultDept && !adminLevel.showAllDepartments){
            this.serviceOptions['defaultDept'] = true;
            this.singleACConfig['serviceOptions'] = this.serviceOptions;
        }
        if(c['name']){
            if(this.name){
                this.labelName = this.name+"picker-ac-textarea";
            } else {
                this.labelName = null;
            }
        }
    }

    reset(){
        this.orgLevels = [
            cloneDeep(DpmtSelectConfig),
            cloneDeep(AgencySelectConfig),
            cloneDeep(OfficeSelectConfig),
            cloneDeep(OfficeSelectConfig),
            cloneDeep(OfficeSelectConfig),
            cloneDeep(OfficeSelectConfig),
            cloneDeep(OfficeSelectConfig)
        ];
        if(this.limit){
            this.orgLevels.length = this.limit;
            this.orgLimit = this.orgLevels.length;
        }
    }

    _orgRootTest(org:any,start:boolean,single:boolean){
        this.serviceCall(org, false, this.hasFpds).subscribe(res => {
            res._embedded = res._embedded.sort(this._nameOrgSort);
            let formattedData = this.formatHierarchy(res._embedded);
            formattedData[0].hierarchy = [];
            for(let i = 1; i < formattedData[0].level; i++){
                if(start){
                    this.orgLevels[i-1].options.length = 0;
                }
                this.orgLevels[i-1].options = this.orgLevels[i-1].options.concat([{value:formattedData[0]["l"+i+"OrgKey"],label:formattedData[0]["l"+i+"Name"],name:formattedData[0]["l"+i+"Name"]}]);
                if(single){ this.orgLevels[i-1].selectedOrg = ""+formattedData[0]["l"+i+"OrgKey"]; }
                this.orgLevels[i-1].show = true;
            }
            if(single){this.orgLevels[formattedData[0].level-1].options.length = 0;}
            this.orgLevels[formattedData[0].level-1].options = this.orgLevels[formattedData[0].level-1].options.concat(formattedData);
            if(single){this.orgLevels[formattedData[0].level-1].selectedOrg = ""+formattedData[0]['orgKey'];}
            this.orgLevels[formattedData[0].level-1].show = true;
            if(single){this.updateAdvanced(formattedData[0].level-1,this.orgLevels[formattedData[0].level-1].selectedOrg);}
            if(this.orgRootLevel < formattedData[0].level){
                this.orgRootLevel = formattedData[0].level-1;
            }
        });
    }

    prepareAdvanced(){
        if(this.orgRoots && this.orgRoots.length>0){
            //can api return multiple specified orgs?
            for(let idx in this.orgRoots){
                let org = this.orgRoots[idx];
                let start = parseInt(idx) == 0?true:false;
                let single = this.orgRoots.length==1?true:false;
                this._orgRootTest(org,start,single);
            }
        } else {
            this.serviceCall("", true, this.hasFpds).subscribe(res => {
                res._embedded = res._embedded.sort(this._nameOrgSort);
                let formattedData = this.formatHierarchy(res._embedded);
                this.orgLevels[0].options.length = 1;
                this.orgLevels[0].options = this.orgLevels[0].options.concat(formattedData);
            });
        }
    }

    ngOnInit(){
        if(this.type=="multiple"){
            this.selections = [];
        }
        if(this.defaultDept && !adminLevel.showAllDepartments){
            this.iamService.iam.user.get((data)=>{
                this.orgRoots = [data.departmentID];
                this.reset();
                this.prepareAdvanced();
                this.serviceOptions['parent'] = this.orgRoots[0];
                this.singleACConfig['serviceOptions'] = this.serviceOptions;
            }, (err)=>{
                console.warn("could not load user's org data - ",err);
            });
        }
        else if(this.orgRoots.length==0){
            this.reset();
            this.prepareAdvanced();
        }
        if(this.control){
            this.control.statusChanges.subscribe(()=>{
                this.wrapper.formatErrors(this.control);
            });
        }
      this.serviceOptions['activeOnly'] = this.activeOnly;
      this.singleACConfig['activeOnly'] = this.activeOnly;
      this.serviceOptions['hasFpds'] = this.hasFpds;
    }

    ngAfterViewInit(){
        if(this.control){
            this.wrapper.formatErrors(this.control);
            this.cdr.detectChanges();
        }
    }

    toggleAdvanced(){
        this.showAdvanced = !this.showAdvanced;
    }

    updateAdvanced(lvl,selection){
        if(selection){
          let ctx = this;
            this.serviceCall(selection, true, this.hasFpds).subscribe(oData => {
                //filter and sort if too many results
                oData = oData._embedded[0].org;
                oData["hierarchy"] = oData["hierarchy"]
                  .filter(this.activeOnly? this._filterActiveOrgs : this._validOrgs)
                  .sort(this._nameOrgSort);

                if(oData["hierarchy"].length > this.dropdownLimit) {
                    oData["hierarchy"].length = this.dropdownLimit;
                }

                let formattedData;
                let nextLvl = lvl+1;
                for(let idx in this.orgLevels){
                    if(idx>=nextLvl){
                        this.orgLevels[idx].options.length = 1;
                        this.orgLevels[idx].options.selectedOrg = "";
                        this.orgLevels[idx].show = false;
                    }
                }
                if(this.orgLevels.length > nextLvl
                    && oData['hierarchy']
                    && oData['hierarchy'].length > 0) {

                    formattedData = this.formatHierarchy(oData["hierarchy"]);
                    this.setAdvancedOrgOptions(nextLvl,formattedData);
                }

            });
        } else {
            for(var idx in this.orgLevels){
                if(lvl<idx){
                    this.orgLevels[idx].selectedOrg = "";
                    this.orgLevels[idx].options.length = 1;
                    this.orgLevels[idx].show = false;
                }
            }
        }
    }

    setAdvancedOrgOptions(lvl, data){
        this.orgLevels[lvl].selectedOrg = "";
        this.orgLevels[lvl].options.length = 1;
        this.orgLevels[lvl].options = this.orgLevels[lvl].options.concat(data);
        this.orgLevels[lvl].show = true;
    }

    makeSelectionFromAdvanced(){
        let selectedOrgs = [];
        for(var idx in this.orgLevels){
            if(this.orgLevels[idx].selectedOrg){
                let selection = this.orgLevels[idx].selectedOrg;
                let orgOption = this.orgLevels[idx].options.find((item)=>{
                    return item.value == selection;
                });
                if(this.hasFpds && (orgOption['name'].indexOf('[') < 1)){
                    // this.removeDuplicateOrgType(orgOption);
                    let fpdsCode = orgOption['fpdsCode'] || orgOption['fpdsOrgId'] || 'N/A';
                    let department = orgOption['type'] ? orgOption['type'].charAt(0) : 'N/A';
                    orgOption['name'] = orgOption['name'] + ' [' + department + '] [' + fpdsCode +']';
                }
                selectedOrgs.push(orgOption);
            }
        }
        if(selectedOrgs.length>0){
            let org = selectedOrgs[selectedOrgs.length-1];
            this.addSelection(org);
            this.showAdvanced = false;
        }
    }

    removeDuplicateOrgType(org) {
        let newOrgType = org.type || org[0].type;
        for (let i in this.selections) {
            if (this.selections[i].type === newOrgType) {
                this.selections.splice(i, 1);
            }
        }
    }

    clearAdvanced(){
        for(var idx in this.orgLevels){
            if(parseInt(idx) >= this.orgRootLevel){
                if(this.orgLevels[idx].selectedOrg){
                    this.orgLevels[idx].selectedOrg = "";
                }

                if(this.orgRootLevel > 0 && parseInt(idx) == this.orgRootLevel){
                    this.orgLevels[idx].show = true;
                } else if(parseInt(idx) > 0){
                    this.orgLevels[idx].options.length = 1;
                    this.orgLevels[idx].show = false;
                }
            }
        }
    }

    addSelection(val,emit:boolean = true){
        if(this.type=="multiple" && !Array.isArray(val)){
            if(!this.isDuplicateSelection(val)){
                this.selections.push(val);
            }
        } else {
            // removes organization if organization type already exists in selection list
            if (this.hasFpds) {
                let comparison = val.slice();
                comparison.pop();
                if(comparison && comparison.length > 0){
                    for (let i in comparison) {
                        if (comparison[i].type === val[val.length-1].type) {
                            val.splice(i, 1);
                        }
                    }
                }
            };
            this.selections = val;
        }
        if(emit){
            this.emitSelections();
        }
    }

    isDuplicateSelection(org){
        return this.selections.includes(org);
    }

    emitSelections(){
        this.onChange(this.selections);
    }

    serviceCall(orgId, hierarchy: boolean, hasFpds: boolean) {
        if(orgId != "") {
            return this.oFHService.getOrganizationById(orgId, hierarchy ? true : false, false, 'all', 300, undefined, undefined, hasFpds);
        } else {
            return this.oFHService.getDepartments(hasFpds);
        }
    }

    formatHierarchy(data) {
        return data.map((el,idx)=>{
            let org = el['org'];
            org["value"] = org["orgKey"];
            if(this.hasFpds){
                let fpdsCode = org['fpdsCode'] || org['fpdsOrgId'] || 'N/A';
                let department = org['type'] ? org['type'].charAt(0) : 'N/A';
                org["label"] = this.fhTitleCasePipe.transform(org["name"]) + ' [' + department + '] [' + fpdsCode +']';
            } else {
                org["label"] = this.fhTitleCasePipe.transform(org["name"]);
            }
            org["name"] = this.fhTitleCasePipe.transform(org["name"]);
            return org;
        });
    }

    //util methods
    _nameOrgSort(a, b) {
        if(a["org"]["name"].toLowerCase() < b["org"]["name"].toLowerCase()) return -1;
        if(a["org"]["name"].toLowerCase() > b["org"]["name"].toLowerCase()) return 1;
        return 0;
    }

    _filterActiveOrgs(org) {
        if(org["org"]['type']=="OFFICE" && org["org"]['modStatus'] && org["org"]['modStatus'].toLowerCase()!="active")
            return false;
        if(!org["org"]['name'])
            return false;
        return true;
    }

    _validOrgs(org) {
        if(!org["org"]['name'])
            return false;
        return true;
        }

    //ControlValueAccessor methods
    setDisabledState(disabled) {
        this._disabled = disabled;
    }

    writeValue(value){
        if(this.type=="multiple" && !value){
            value = [];
        }
        let orgKeys = [];
        if(value){
            orgKeys = this.type=="single" ? [value] : value;
        }
        if(orgKeys.length>0){
            this.selections = [];
            this.oFHService.getOrganizations({orgKey:orgKeys.join(",")}).subscribe(res=>{
                let orgs = this.formatHierarchy(res["_embedded"]['orgs']);
                for(let idx in orgs){
                    let val = orgs[idx];
                    this.addSelection(val,this.editOnFlag);
                }
            });
        } else {

            this.selections = value;
        }
    }
    registerOnChange(fn: any) {
        this.onChange = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }
}
