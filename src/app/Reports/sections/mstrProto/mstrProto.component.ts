import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { FormArray, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { IAMService } from 'api-kit';
import { globals } from '../../app/globals';
import { Cookie } from 'ng2-cookies';
import all = protractor.promise.all;

@Component({
    providers: [IAMService],
    templateUrl: './mstrProto.template.html',
})
export class MstrProtoComponent implements OnInit {
    @ViewChild('samAccordionValue') samAccordionValue;
    @ViewChild('reportForm') reportForm;
    @ViewChild('urlForm') urlForm;
    @ViewChild('customText') customText;
    @ViewChild('customUrl') customUrl;
    @ViewChild('agencyPicker') agencyPicker;
    public id;
    public name;
    public desc = null;
    public pwd = null;
    public appendix = [];
    url: SafeResourceUrl;
    urlPassed;
    public states = {
        isSignedIn: false
    };

    data: Object;
    totalReportCount: number = 0;

    public user = null;
    organizationId: string = '';
    agencyPickerValue = [];
    dateRange;
    showReport: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router, private zone: NgZone, private api: IAMService, private sanitizer: DomSanitizer,
        private http: Http) {
        this.zone.runOutsideAngular(() => {
            this.checkSession(() => {
                this.zone.run(() => {
                    // Callback
                });
            });
        });
        http.get('src/assets/standardReport.json')
            .map(res => res.json())
            .subscribe(data => this.data = data,
            err => console.log(err),
            () => console.log('Completed'));
    }

    ngOnInit() {
        this.name = 'Prototype Report for Common Components';

        // this.id = this.route.snapshot.params['id'];
        // this.name = this.route.snapshot.params['name'];
        // this.desc = this.route.snapshot.params['desc'];

        // this.route.queryParams.subscribe(
        // data => {

        //     this.organizationId = typeof data['organizationId'] === "string" ? decodeURI(data['organizationId']) : "";

        // });
    }

    checkSession(cb: () => void) {
        let vm = this;
        this.api.iam.user.get(function (user) {
            vm.states.isSignedIn = true;
            vm.user = user;

            cb();
        });
    }

    reportExecuteTest() {
        let vm = this;
        vm.showReport = true;
        vm.url = vm.sanitizer.bypassSecurityTrustResourceUrl('https://microstrategydev.helix.gsa.gov/MicroStrategy/servlet/mstrWeb?Server=MICROSTRATEGY-3_BI.PROD-LDE.BSP.GSA.GOV&Project=SAM_Dev&Port=8443&evt=2048001&src=mstrWeb.2048001&documentID=05CCC86911E74D670CF30080EF85D2E4&currentViewMedia=1&visMode=0&uid=test&pwd=abc123&promptsAnswerXML=<rsl><pa pt="8" pin="0" did="6C72923411E74D652FC90080EF753357" tp="10"><exp><nd et="2" nt="4" dmt="1" ddt="-1"><nd et="1" nt="1" dmt="1" ddt="-1" lcl="0"><at did="2EC9CD4E4E5577C0470A4FBB3DFBB272" tp="12"/><fm did="45C11FA478E745FEA08D781CEA190FE5" tp="21"/></nd><nd et="1" nt="3" dmt="1" ddt="5"><cst ddt="5">'+this.customText.nativeElement.value+'</cst></nd><op fnt="6" fg="0" apply_order="0"/></nd></exp></pa></rsl>');
    }

    reportExecuteCC() {
        let vm = this;

        let startDate = new Date(this.dateRange.startDate),
            startMonth = startDate.getMonth()+1,
            startMonthFormatted = ("0"+startMonth).slice(-2),
            startDay = startDate.getDate()+1,
            startDayFormatted = ("0"+startDay).slice(-2),
            startYear = startDate.getFullYear(),
            startParam = startMonthFormatted + '/' + startDayFormatted + '/' + startYear; 

        let endDate = new Date(this.dateRange.endDate),
            endMonth = endDate.getMonth()+1,
            endMonthFormatted = ("0"+endMonth).slice(-2),
            endDay = endDate.getDate()+1,
            endDayFormatted = ("0"+endDay).slice(-2),
            endYear = endDate.getFullYear(),
            endParam = endMonthFormatted + '/' + endDayFormatted + '/' + endYear; 

        vm.showReport = true;
        vm.url = vm.sanitizer.bypassSecurityTrustResourceUrl('https://microstrategydev.helix.gsa.gov/MicroStrategy/servlet/mstrWeb?&evt=4001&hiddensections=path,dockLeft,footer&uid='+vm.user._id+'&reportID=DDDE38ED469F690E030715A1C1F06F01&role='+vm.user.gsaRAC[0]+'&valuePromptAnswers='+startParam+'^'+endParam+'^'+this.agencyPickerValue["0"].code);

        console.log('startParam: '+startParam);
        console.log('endParam: '+endParam);
        console.log(this.agencyPickerValue["0"].code);
        console.log('https://microstrategydev.helix.gsa.gov/MicroStrategy/servlet/mstrWeb?&evt=4001&hiddensections=path,dockLeft,footer&uid='+vm.user._id+'&reportID=DDDE38ED469F690E030715A1C1F06F01&role='+vm.user.gsaRAC[0]+'&valuePromptAnswers='+startParam+'^'+endParam+'^'+this.agencyPickerValue["0"].code);
    }

    reportExecuteUrl() {
        let vm = this;
        this.urlPassed = this.customUrl.nativeElement.value;
        vm.url = vm.sanitizer.bypassSecurityTrustResourceUrl(this.customUrl.nativeElement.value);
    }
}
