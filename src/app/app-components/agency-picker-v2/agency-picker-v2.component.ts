import { Component, ChangeDetectorRef, forwardRef, Directive, Input, ElementRef, Renderer, Output, OnInit, EventEmitter, ViewChild, SimpleChanges } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FHService, IAMService } from "api-kit";
import { ControlValueAccessor,NG_VALUE_ACCESSOR,AbstractControl } from '@angular/forms';
import { DpmtSelectConfig, AgencySelectConfig, OfficeSelectConfig } from './configs';
import { LabelWrapper } from "sam-ui-kit/wrappers/label-wrapper";
import { FHTitleCasePipe } from "../../app-pipes/fhTitleCase.pipe";
import adminLevel from "app/role-management/admin-level";
import * as _ from 'lodash';

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
        if(c['defaultDept'] && this.defaultDept && adminLevel.adminLevel !== 0){
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
            _.cloneDeep(DpmtSelectConfig),
            _.cloneDeep(AgencySelectConfig),
            _.cloneDeep(OfficeSelectConfig),
            _.cloneDeep(OfficeSelectConfig),
            _.cloneDeep(OfficeSelectConfig),
            _.cloneDeep(OfficeSelectConfig),
            _.cloneDeep(OfficeSelectConfig)
        ];
        if(this.limit){
            this.orgLevels.length = this.limit;
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
        if(this.defaultDept && adminLevel.adminLevel !== 0){
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
        let useFpds = this.hasFpds;
        if(selection){
            if (lvl >= 1) {
                useFpds = false;
            }
            this.serviceCall(selection, true, useFpds).subscribe(oData => {
                //filter and sort if too many results
                oData = oData._embedded[0].org;
                oData["hierarchy"] = oData["hierarchy"]
                .filter(this._filterActiveOrgs)
                .sort(this._nameOrgSort);

                if(oData["hierarchy"].length > this.dropdownLimit) {
                    oData["hierarchy"].length = this.dropdownLimit;
                }

                let formattedData;
                if(oData['hierarchy'] && oData['hierarchy'].length > 0) {

                    for(let idx in this.orgLevels){
                        if(idx>lvl+1){
                            this.orgLevels[idx].options.length = 1;
                            this.orgLevels[idx].options.selectedOrg = "";
                            this.orgLevels[idx].show = false;
                        }
                    }
                    formattedData = this.formatHierarchy(oData["hierarchy"]);
                    this.setAdvancedOrgOptions(lvl+1,formattedData);
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
                selectedOrgs.push(orgOption);
            }
        }
        if(selectedOrgs.length>0){
            let org = selectedOrgs[selectedOrgs.length-1];
            this.addSelection(org);
            this.showAdvanced = false;
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
            let level = el["org"]["level"];
            el["org"]["value"] = el["org"]["orgKey"];
            el["org"]["label"] = this.fhTitleCasePipe.transform(el["org"]["name"]);
            el["org"]["name"] = this.fhTitleCasePipe.transform(el["org"]["name"]);
            return el["org"];
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
