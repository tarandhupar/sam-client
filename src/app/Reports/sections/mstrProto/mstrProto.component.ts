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
    @ViewChild('startDateDom') startDateDom;
    @ViewChild('testForm') testForm;
    public id;
    public name;
    public desc = null;
    public pwd = null;
    public appendix = [];
    url: SafeResourceUrl;
    public states = {
        isSignedIn: false
    };

    data: Object;
    totalReportCount: number = 0;

    public user = null;
    organizationId: string = '';
    agencyPickerValue = [];

    chosenDate;
    startDate;
    // form: FormGroup;
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

    resetParameter() {
        this.reportForm.reset();
        this.startDate = '';
        this.showReport = false;
        console.log(this.reportForm);
    }

    reset() {
        // this.form.reset();
    }

    checkSession(cb: () => void) {
        let vm = this;
        this.api.iam.user.get(function (user) {
            vm.states.isSignedIn = true;
            vm.user = user;

            cb();
        });
    }

    reportExecute() {
        let vm = this;
        vm.showReport = true;

        // initial report and prompt id provided by ravi (variables)

        // vm.url = vm.sanitizer.bypassSecurityTrustResourceUrl
        //     ('https://microstrategydev.helix.gsa.gov/MicroStrategy/servlet/mstrWeb?&evt=4001&hiddensections=path,dockLeft,footer'
        //     + '&uid=' + vm.user._id
        //     + '&reportID=2673CF484B17EFA967D812AB9E95AAFA'
        //     + '&role=ADMIN' + vm.user.gsaRAC[0].role
        //     + '&promptID=91E50900464D0991F30DCC9CFFB1CFC3'
        //     + '&startDate=' + vm.startDate);


        // initial report and prompt id provided by ravi (hardcoded)

        // vm.url = vm.sanitizer.bypassSecurityTrustResourceUrl
        //     ('https://microstrategydev.helix.gsa.gov/MicroStrategy/servlet/mstrWeb?&evt=4001&hiddensections=path,dockLeft,footer&uid=melissa.hughes@wtsintegration.com&reportID=2673CF484B17EFA967D812AB9E95AAFA&role=ADMIN&promptID=91E50900464D0991F30DCC9CFFB1CFC3&startDate=' + vm.startDate);


        // new

        // vm.url = vm.sanitizer.bypassSecurityTrustResourceUrl
        //     ('https://microstrategydev.helix.gsa.gov/MicroStrategy/servlet/mstrWeb?&evt=4001&hiddensections=path,dockLeft,footer&uid=' + vm.user._id + '&reportID=2673CF484B17EFA967D812AB9E95AAFA&role=' + vm.user.gsaRAC[0].role + '&promptID=91E50900464D0991F30DCC9CFFB1CFC3&startDate=' + vm.startDate);
        //     console.log('vm.startDate: ' + vm.startDate);
        //     console.log(vm.url);
            vm.url = vm.sanitizer.bypassSecurityTrustResourceUrl
            ('https://microstrategydev.helix.gsa.gov/MicroStrategy/servlet/mstrWeb?&evt=4001&hiddensections=path,dockLeft,footer&uid=ravi.kallur@reisystems.com&reportID=B28692A011E654DE00000080EFC552E7&role=GSA_REPORT_R_NASA_ADMIN_8000&valuePromptAnswers=' + vm.testForm.nativeElement.value);
            console.log('vm.testForm.nativeElement.value: ' + vm.testForm.nativeElement.value);
            console.log(vm.url);
    }
    reportExecuteTest() {
        let vm = this;
        vm.showReport = true;
        // vm.url = vm.sanitizer.bypassSecurityTrustResourceUrl
        //     ('https://microstrategydev.helix.gsa.gov/MicroStrategy/servlet/mstrWeb?&evt=4001&hiddensections=path,dockLeft,footer&uid=' + vm.user._id + '&reportID=B28692A011E654DE00000080EFC552E7&role=' + vm.user.gsaRAC[0].role + '&promptID=52EBA1A64974BBEF0D70179D5D86B0B2&startDate=' + vm.testForm.nativeElement.value);
        //     console.log('vm.testForm.nativeElement.value: ' + vm.testForm.nativeElement.value);
        //     console.log(vm.url);

        // vm.url = vm.sanitizer.bypassSecurityTrustResourceUrl
        //     ('https://microstrategydev.helix.gsa.gov/MicroStrategy/servlet/mstrWeb?&evt=4001&hiddensections=path,dockLeft,footer&uid=Test&reportID=B28692A011E654DE00000080EFC552E7&valuePromptAnswers=' + vm.testForm.nativeElement.value);
        //     console.log('vm.testForm.nativeElement.value: ' + vm.testForm.nativeElement.value);
        //     console.log(vm.url);

            vm.url = vm.sanitizer.bypassSecurityTrustResourceUrl
            ('https://microstrategydev.helix.gsa.gov/MicroStrategy/servlet/mstrWeb?Server=MICROSTRATEGY-3_BI.PROD-LDE.BSP.GSA.GOV&Project=SAM_Dev&Port=8443&evt=2048001&src=mstrWeb.2048001&documentID=05CCC86911E74D670CF30080EF85D2E4&currentViewMedia=1&visMode=0&promptsAnswerXML=<rsl><pa pt="8" pin="0" did="6C72923411E74D652FC90080EF753357" tp="10"><exp><nd et="2" nt="4" dmt="1" ddt="-1"><nd et="1" nt="1" dmt="1" ddt="-1" lcl="0"><at did="2EC9CD4E4E5577C0470A4FBB3DFBB272" tp="12"/><fm did="45C11FA478E745FEA08D781CEA190FE5" tp="21"/></nd><nd et="1" nt="3" dmt="1" ddt="5"><cst ddt="5">'+vm.testForm.nativeElement.value+'</cst></nd><op fnt="6" fg="0" apply_order="0"/></nd></exp></pa></rsl>');
            console.log('vm.testForm.nativeElement.value: ' + vm.testForm.nativeElement.value);
            console.log(vm.url);

            // &uid=ravi.kallur@reisystems.com
            // &role=GSA_REPORT_R_NASA_ADMIN_8000
    }
}

