import { Component, Input, Output, EventEmitter, NgZone, NgModule, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IAMService } from 'api-kit';
import { SamUIKitModule } from 'sam-ui-kit';
import { globals } from '../../app/globals';

export const REPORTS_PER_PAGE: number = 10;

@Component({
  providers: [IAMService],
  templateUrl: './overview.template.html',
})
export class OverviewComponent {
  public states = {
    isSignedIn: false,
    showSignIn: true,
    isAdmin: false
  };
  public user = null;
  public userRoles = null;
  public dbReports = null;
  public currentReports = null;
  public liked = true;
  currentPage: number = 1;
  totalReportCount: number = 0;
  currentReportStartIndex: number = 0;
  currentReportEndIndex: number = 0;
  selectedIdx = null;
  errorMessage: string;
  mode = 'Observable';

  constructor(private router: Router, private zone: NgZone, private api: IAMService,) {
    this.zone.runOutsideAngular(() => {
      this.checkSession(() => {
        this.zone.run(() => {
          // Callback
        });
      });
    });
  }

  totalPages(): number {
    return Math.floor((this.totalReportCount) / REPORTS_PER_PAGE) + 1;
  }
  onParamChanged(page) {
    // if this is a page change, the page parameter is > 1
    if (page) {
      this.currentPage = page;
    } else {
      this.currentPage = 1;
    }
    this.getReports();
  }

  selectItem(index): void {
    this.selectedIdx = index;
    this.liked = !this.liked;
  }

  /* addUser(index: string) {
   if (!index) { return; }
   this.repotsService.create(index)
   .subscribe(
   user  => this.users.push(user),
   error =>  this.errorMessage = <any>error);
   } */

  getReports() {
    let startIndex: number = (this.currentPage - 1) * REPORTS_PER_PAGE;
    let endIndex: number = startIndex + REPORTS_PER_PAGE;

    this.currentReportStartIndex = startIndex + 1;

    if (endIndex > this.totalReportCount) {
      this.currentReportEndIndex = this.totalReportCount;
    } else {
      this.currentReportEndIndex = endIndex;
    }

    this.currentReports = this.dbReports.slice(startIndex, endIndex);
  }

  checkSession( cb: () => void ) {
    let vm = this;

    this.api.iam.user.get(function(user) {
      vm.states.isSignedIn = true;
      vm.states.showSignIn = false;
      vm.userRoles = user.gsaRAC;

      let isReportsUser = false;
      let isReportsAdmin = false;

      for (let _i = 0; _i < vm.userRoles.length; _i++) {
        if (vm.userRoles[_i].role.indexOf('GSA_REPORT_R') >= 0) {
          isReportsUser = true;
        }

        if (vm.userRoles[_i].role.indexOf('ADMIN') >= 0) {
          isReportsAdmin = true;
        }

        if (isReportsUser && isReportsAdmin) {
          // User is an Admin user
          vm.states.isAdmin = true;
        }
      }
      vm.user = user;
      if (vm.states.isAdmin) {
        vm.dbReports = [{
          id: 'DDDE38ED469F690E030715A1C1F06F01',
          name: 'Awards by Contractor Type',
          reportType: 'dynamic',
          desc: 'This report displays the dollars and actions for Awards by Contractor Type. The report also' +
          ' allows drilling down to the PIID level.'
        },
          {
            id: 'AA10685B4D7D5CE94B3EE5827690C161',
            name: 'Bundled and Consolidated Contracts Report',
            reportType: 'dynamic',
            desc: 'This Report Displays the actions and dollars for Bundled and Consolidated Contracts that exceed' +
            ' the threshold that was in place on the date signed of the action.'
          },
          {
            id: '753B1C7B40477576787A7481E04BB6CD',
            name: 'Buy American Act Place of Manufacture Report',
            reportType: 'dynamic',
            desc: 'This report displays the Actions and Dollars for manufactured end items across the Federal' +
            ' Government using the values of Place of Manufacture.'
          },
          {
            id: '7AB734B64A8650C22912479CD9DA8A3B',
            name: 'Buying Through Government Acquisition Vehicles Report',
            reportType: 'dynamic',
            desc: 'The Buying Through Government Acquisition Vehicles report displays actions and dollars for all' +
            ' contract actions (Awards, IDVs, and Modifications) based on Who Can Use on the IDV and based on' +
            ' Department ID for Awards referencing an IDV.'
          },
          {
            id: '06EC27254E91094518B76FA4E6449EE9',
            name: 'Competition Report',
            reportType: 'dynamic',
            desc: 'This is the official competition report. It provides both a summary level report and detailed' +
            ' drilldowns based on statutory exceptions.'
          },
          {
            id: 'F93C7D5846D6FFF1002156A8927700C0',
            name: 'Competition Report – OLD',
            reportType: 'dynamic',
            desc: 'NOT THE OFFICIAL REPORT FOR COMPETITION. This is the old competition report and does not provide' +
            ' as accurate a representation as the Competition Report.'
          },
          {
            id: '1E843D294B046BC4DFBF9C993853B76F',
            name: 'Competitive Procedures, but one Offer Report',
            app: 'ANOMALY',
            reportType: 'dynamic',
            desc: 'This report displays Competed (Competed Under SAP, Full and Open Competition, Full and Open' +
            ' Competition after Exclusion of Sources and Fair Opportunity) data that has only one offer.',
            verb: 'This report has been identified as having anomalies in the entered award data.  Agencies should' +
            ' review the report to confirm the integrity of their data.'
          },
          {
            id: 'B28692A011E654DE00000080EFC552E7',
            name: 'Contract Detail Report',
            reportType: 'dynamic',
            desc: 'This report provides the complete contractual data for the specified PIID.'
          },
          {
            id: '8174C9DC4246D0A716FC44B97C7200B9',
            name: 'Contract Termination for Default-Cause Report',
            app: 'ANOMALY',
            reportType: 'dynamic',
            desc: 'This report reflects the "Termination for Default (complete or partial)" and "Termination for' +
            ' Cause" data for the Date range specified.',
            verb: 'This report has been identified as having anomalies in the entered award data.  Agencies should' +
            ' review the report to confirm the integrity of their data.'
          },
          {
            id: '932E68BE4DFDD8AC5294DDB758564136',
            name: 'Contractor Search',
            reportType: 'dynamic',
            desc: 'This Report shows Total Actions and Dollars for a given Contractor.'
          },
          {
            id: '5FFCCA5A4AAD0B21AC6CBCBA797BBFE1',
            name: 'Federal Contract Actions and Dollars',
            reportType: 'dynamic',
            desc: 'This report displays the federal contract actions and dollars for the specified date signed range.'
          },
          {
            id: 'BC3966024DFC84E4475B33ACA2190E57',
            name: 'Funding Report',
            reportType: 'dynamic',
            desc: 'This report provides data pertaining to federal funding. It provides total actions/dollars an' +
            ' agency has awarded on behalf of another agency, as well as the total actions/dollars the agency has' +
            ' awarded using their own funds.'
          },
          {
            id: '40ABE0CB4C2B71AC512B329C744FC867',
            name: 'Geographical Report by Place of Performance',
            reportType: 'dynamic',
            desc: 'This report provides data on all Awards and Modifications based on the Place of Performance. ' +
            'The report displays the Place of Performance state or country name.'
          },
          {
            id: '303AA968456B5ECFA9AB3FA51E75AF06',
            name: 'Geographical Report by Vendor Location',
            reportType: 'dynamic',
            desc: 'This report provides data on all Awards, Indefinite Delivery Vehicles, and Modifications ' +
            'based on the vendor location. The report displays the vendor state or country name.'
          },
          {
            id: 'C14899804687687D40568A98753E4F80',
            name: 'IDVs whose Orders are over the Ceiling Amount',
            app: 'ANOMALY',
            reportType: 'dynamic',
            desc: 'This report displays EPA Designated Product and Recovered Materials/Sustainability data for the ' +
            'specified date range and PSC range.',
            verb: 'This report has been identified as having anomalies in the entered award data.  Agencies should ' +
            'review the report to confirm the integrity of their data.'
          },
          {
            id: '6FE920084CE8728B91C1A2B336506FA6',
            name: 'Individual Data Item Oversight Tracker Report',
            reportType: 'dynamic',
            desc: 'This report provides the contractual detail required by Agency System Administrators to review ' +
            'their contracts.'
          },
          {
            id: '608FAD0F450FE275E759439CD69FEFA0',
            name: 'Inherently Governmental Functions Actions and Dollars',
            reportType: 'dynamic',
            desc: 'This report displays the actions and dollars for ‘Closely Associated’, ‘Critical Functions’, ' +
            '‘Other Functions’ and ‘Null Inherently Governmental Functions’ when ‘Service’ is selected for PSC.'
          },
          {
            id: '4B1FD6CB489C41AE75D8E59498603240',
            name: 'Local Area Set Aside Report',
            reportType: 'dynamic',
            desc: 'This report displays the federal actions and the dollars for those activities of major disaster' +
            ' or emergency, where preference was given to the local firms through a local area set-aside.'
          },
          {
            id: 'EDBDC44E4D0D9F382B7059A7214E0500',
            name: 'National Interest Action Report',
            reportType: 'dynamic',
            desc: 'This report provides the National Interest Action data. It provides the contractual data' +
            ' pertaining to federal spending on National Interest Actions such as Katrina, Rita et al.'
          },
          {
            id: 'AD0F65FB4BD2B19C30C2979D31442D2D',
            name: 'Orders placed after IDV\'s Last Date to Order',
            reportType: 'dynamic',
            desc: 'This report displays Orders that are placed after their IDV\'s Last Date to Order.'
          },
          {
            id: '6B8BE08D4B3C807D09FEF6A6054F1A55',
            name: 'Orders Referencing Incorrect IDV',
            reportType: 'dynamic',
            desc: 'This report displays Delivery Orders/Task Orders (DO/TO) and BPA Calls that were placed against' +
            ' an IDV by an agency that does not have the authority to use the Referenced IDV.'
          },
          {
            id: '37A44ED54B619E53FEDA4E8A3AE0DE78',
            name: 'Other Transaction Actions and Dollars Report',
            reportType: 'dynamic',
            desc: 'This report displays the Other Transaction actions and dollars for the specified date signed range.'
          },
          {
            id: '338E9AB44BC3E6A2BA6BC5B923CF9965',
            name: 'Performance Based Acquisition Report',
            reportType: 'dynamic',
            desc: 'This report displays the actions, dollars and percentages for the performance based acquisition' +
            ' contracts for the specified date range. It also provides drill down capability to view specific' +
            ' report details, including field values for the contract.'
          },
          {
            id: '3F69E8FF471B08F686A986840B30E250',
            name: 'Potential Vendor Anomaly Report',
            app: 'ANOMALY',
            reportType: 'dynamic',
            desc: 'This report displays all the contracts that are marked as Small Business by contracting officer' +
            ' and the contractor is one of the Top 100 Federal Contractors.',
            verb: 'This report has been identified as having anomalies in the entered award data.  Agencies should' +
            ' review the report to confirm the integrity of their data.'
          },
          {
            id: '03DDC6C04986ECFD3B8273B18E40E2E9',
            name: 'Procurement History for Market Research Report',
            reportType: 'dynamic',
            desc: 'This report provides total dollars awarded to all vendors for a Product and Service Code (PSC)' +
            ' given in the search criteria. The dollars are aggregated by the unique entry reported in the' +
            ' Description of Requirents field.'
          },
          {
            id: 'FED44C46426A02DC9A52A1B5B62EFB1F',
            name: 'Purchase Card as Payment Method Report',
            reportType: 'dynamic',
            desc: 'This report displays the procurement actions within a specified date range where the Purchase' +
            ' Card was used/not used as a method of payment.'
          },
          {
            id: 'D5D3504B4B3DB63B7CA64BAC19C82C57',
            name: 'Recycled Content Product Purchasing Data Report',
            reportType: 'dynamic',
            desc: 'The report displays actions and dollars for Product or Service Code (PSC) Categories and how ' +
            'many of them are acquired by Commercial Item procedures at the Federal Government level.'
          },
          {
            id: 'F33EC2D94E1D79A8725D1D8979843E7F',
            name: 'Rerepresentation Eligible Actions Report',
            reportType: 'dynamic',
            desc: 'The report displays actions and dollars for Product or Service Code (PSC) Categories and how ' +
            'many of them are acquired by Commercial Item procedures at the Federal Government level.'
          },
          {
            id: '189104574CDD38D699ED0495CEA33B34',
            name: 'Rerepresentation Report',
            reportType: 'dynamic',
            desc: 'The report displays actions and dollars for Product or Service Code (PSC) Categories and how ' +
            'many of them are acquired by Commercial Item procedures at the Federal Government level.'
          },
          {
            id: '58E1A11A4C0ABE733DD8D899C1ACCEC4',
            name: 'Small Business Achievements by Awarding Organization Report',
            reportType: 'dynamic',
            desc: 'The Small Business Achievements by Awarding Agency displays the dollars, actions, and percentages' +
            ' for small business contracts. The goaling exclusions apply to this report. This report is run by' +
            ' awarding agency.'
          },
          {
            id: '6D869CB5461F97594628C8B5468B2287',
            name: 'Small Business Competitiveness Demonstration Program Report',
            reportType: 'dynamic',
            desc: 'The report displays actions and dollars for Product or Service Code (PSC) Categories and how ' +
            'many of them are acquired by Commercial Item procedures at the Federal Government level.'
          },
          {
            id: '5C31085043356E0EA5A6049735A9B03A',
            name: 'Small Business Goaling Report',
            reportType: 'dynamic',
            desc: 'This report displays the dollars, actions, and percentages for small business contracts. The' +
            ' goaling exclusions apply to this report. This report is run by funding agency.'
          },
          {
            id: 'D70B108040683D73AB7D6B8622052D67',
            name: 'Subcontracting Plan Report',
            app: 'ANOMALY',
            reportType: 'dynamic',
            desc: 'This report displays "Plan Required - Incentive Not Included", "Plan Required - Incentive' +
            ' Included", "Plan Required (Pre 2004)", "Individual Subcontract Plan", "Commercial Subcontract Plan" ' +
            'or "DOD Comprehensive Subcontract Plan" for base documents.',
            verb: 'This report has been identified as having anomalies in the entered award data.  Agencies ' +
            'should review the report to confirm the integrity of their data.'
          },
          {
            id: '9555AB4F41EAD3556383CB936AADF2AC',
            name: 'Sustainability Report',
            reportType: 'dynamic',
            desc: 'This report displays actions and dollars for the "Recovered Materials/Sustainability" values. ' +
            'Actions with a foreign Place of Performance or a Claimant Program coded as Weapons are excluded ' +
            'from this report.'
          },
          {
            id: '6B11AF1648055A614207B69E659F9AE8',
            name: 'Total Actions by NAICS Report',
            reportType: 'dynamic',
            desc: 'The report displays actions and dollars for North American Industry Classification System ' +
            '(NAICS) Categories and how many of them are acquired by Commercial Item procedures at the Federal ' +
            'Government level.'
          },
          {
            id: 'DED49FC94E5F54DDDEADBDA5E4CFE8BF',
            name: 'Total Actions by PSC Report',
            reportType: 'dynamic',
            desc: 'The report displays actions and dollars for Product or Service Code (PSC) Categories and how ' +
            'many of them are acquired by Commercial Item procedures at the Federal Government level.'
          },
          {
            id: '42D7D77D4C317D8F2D2512AB0CFA31FB',
            name: 'Trade Agreements Report',
            reportType: 'dynamic',
            desc: 'The report displays actions and dollars for Product or Service Code (PSC) Categories and how ' +
            'many of them are acquired by Commercial Item procedures at the Federal Government level.'
          },
          {
            id: '765653484A5BD0ECC8C0CBA42AA625E3',
            name: 'Unique Vendors Report',
            app: 'ANOMALY',
            reportType: 'dynamic',
            desc: 'This report reflects the number of Unique Vendors in a given Fiscal Year.',
            verb: 'This report has been identified as having anomalies in the entered award data.  Agencies should' +
            ' review the report to confirm the integrity of their data.'
          },
          {
            id: '63AAC2FE47DB4E0515AAD48BAE7C8872',
            name: 'Workload Report',
            reportType: 'dynamic',
            desc: 'This report displays actions and dollars for all the federal government contracts for various' +
            ' dollar ranges, thus displaying the workload. It also drills down to the workload by Type of Contract' +
            ' and displays actions and dollars for each contract type.'
          }
        ];
      } else {
        vm.dbReports = [{
          id: 'DDDE38ED469F690E030715A1C1F06F01',
          name: 'Awards by Contractor Type',
          reportType: 'dynamic',
          desc: 'This report displays the dollars and actions for Awards by Contractor Type. The report also' +
          ' allows drilling down to the PIID level.'
        },
          {
            id: 'AA10685B4D7D5CE94B3EE5827690C161',
            name: 'Bundled and Consolidated Contracts',
            reportType: 'dynamic',
            desc: 'This Report Displays the actions and dollars for Bundled and Consolidated Contracts that' +
            ' exceed the threshold that was in place on the date signed of the action.'
          },
          {
            id: '753B1C7B40477576787A7481E04BB6CD',
            name: 'Buy American Act Place of Manufacture Report',
            reportType: 'dynamic',
            desc: 'This report displays the Actions and Dollars for manufactured end items across the Federal' +
            ' Government using the values of Place of Manufacture.'
          },
          {
            id: '7AB734B64A8650C22912479CD9DA8A3B',
            name: 'Buying Through Government Acquisition Vehicles Report',
            reportType: 'dynamic',
            desc: 'The Buying Through Government Acquisition Vehicles report displays actions and dollars for all' +
            ' contract actions (Awards, IDVs, and Modifications) based on Who Can Use on the IDV and based on' +
            ' Department ID for Awards referencing an IDV.'
          },
          {
            id: '06EC27254E91094518B76FA4E6449EE9',
            name: 'Competition Report',
            reportType: 'dynamic',
            desc: 'This is the official competition report. It provides both a summary level report and ' +
            'detailed drilldowns based on statutory exceptions.'
          },
          {
            id: 'F93C7D5846D6FFF1002156A8927700C0',
            name: 'Competition Report - OLD',
            reportType: 'dynamic',
            desc: 'NOT THE OFFICIAL REPORT FOR COMPETITION. This is the old competition report and does not ' +
            'provide as accurate a representation as the Competition Report.'
          },
          {
            id: '1E843D294B046BC4DFBF9C993853B76F',
            name: 'Competitive Procedures, but one Offer Report',
            app: 'ANOMALY',
            reportType: 'dynamic',
            desc: 'This report displays Competed (Competed Under SAP, Full and Open Competition, Full and Open' +
            ' Competition after Exclusion of Sources and Fair Opportunity) data that has only one offer.',
            verb: 'This report has been identified as having anomalies in the entered award data.  Agencies ' +
            'should review the report to confirm the integrity of their data.'
          },
          {
            id: 'B28692A011E654DE00000080EFC552E7',
            name: 'Contract Detail Report',
            reportType: 'dynamic',
            desc: 'This report provides the complete contractual data for the specified PIID.'
          },
          {
            id: '8174C9DC4246D0A716FC44B97C7200B9',
            name: 'Contract Termination for Default-Cause Report',
            app: 'ANOMALY',
            reportType: 'dynamic',
            desc: 'This report reflects the "Termination for Default (complete or partial)" and "Termination for' +
            ' Cause" data for the Date range specified.',
            verb: 'This report has been identified as having anomalies in the entered award data.  Agencies ' +
            'should review the report to confirm the integrity of their data.'
          },
          {
            id: '932E68BE4DFDD8AC5294DDB758564136',
            name: 'Contractor Search',
            reportType: 'dynamic',
            desc: 'This Report shows Total Actions and Dollars for a given Contractor.'
          },
          {
            id: '5FFCCA5A4AAD0B21AC6CBCBA797BBFE1',
            name: 'Federal Contract Actions and Dollars',
            reportType: 'dynamic',
            desc: 'This report displays the federal contract actions and dollars for the specified date signed range.'
          },
          {
            id: 'BC3966024DFC84E4475B33ACA2190E57',
            name: 'Funding Report',
            reportType: 'dynamic',
            desc: 'This report provides data pertaining to federal funding. It provides total actions/dollars ' +
            'an agency has awarded on behalf of another agency, as well as the total actions/dollars the agency ' +
            'has awarded using their own funds.'
          },
          {
            id: '40ABE0CB4C2B71AC512B329C744FC867',
            name: 'Geographical Report by Place of Performance',
            reportType: 'dynamic',
            desc: 'This report provides data on all Awards and Modifications based on the Place of Performance. ' +
            'The report displays the Place of Performance state or country name.'
          },
          {
            id: '303AA968456B5ECFA9AB3FA51E75AF06',
            name: 'Geographical Report by Vendor Location',
            reportType: 'dynamic',
            desc: 'This report provides data on all Awards, Indefinite Delivery Vehicles, and Modifications based ' +
            'on the vendor location. The report displays the vendor state or country name.'
          },
          {
            id: 'C14899804687687D40568A98753E4F80',
            name: 'IDVs whose Orders are over the Ceiling Amount Report',
            app: 'ANOMALY',
            reportType: 'dynamic',
            desc: 'This report displays EPA Designated Product and Recovered Materials/Sustainability data for ' +
            'the specified date range and PSC range.',
            verb: 'This report has been identified as having anomalies in the entered award data.  Agencies ' +
            'should review the report to confirm the integrity of their data.'
          },
          {
            id: '608FAD0F450FE275E759439CD69FEFA0',
            name: 'Inherently Governmental Functions Actions and Dollars',
            reportType: 'dynamic',
            desc: 'This report displays the actions and dollars for ‘Closely Associated’, ‘Critical Functions’,' +
            ' ‘Other Functions’ and ‘Null Inherently Governmental Functions’ when ‘Service’ is selected for PSC.'
          },
          {
            id: '4B1FD6CB489C41AE75D8E59498603240',
            name: 'Local Area Set Aside Report',
            reportType: 'dynamic',
            desc: 'This report displays the federal actions and the dollars for those activities of major disaster ' +
            'or emergency, where preference was given to the local firms through a local area set-aside.'
          },
          {
            id: 'AD0F65FB4BD2B19C30C2979D31442D2D',
            name: 'Orders placed after IDV\'s Last Date to Order',
            reportType: 'dynamic',
            desc: 'This report displays Orders that are placed after their IDV\'s Last Date to Order.'
          },
          {
            id: '6B8BE08D4B3C807D09FEF6A6054F1A55',
            name: 'Orders Referencing Incorrect IDV Report',
            reportType: 'dynamic',
            desc: 'This report displays Delivery Orders/Task Orders (DO/TO) and BPA Calls that were placed against' +
            ' an IDV by an agency that does not have the authority to use the Referenced IDV.'
          },
          {
            id: '37A44ED54B619E53FEDA4E8A3AE0DE78',
            name: 'Other Transaction Actions and Dollars',
            reportType: 'dynamic',
            desc: 'This report displays the Other Transaction actions and dollars for the specified date signed range.'
          },
          {
            id: '338E9AB44BC3E6A2BA6BC5B923CF9965',
            name: 'Performance Based Acquisition Report',
            reportType: 'dynamic',
            desc: 'This report displays the actions, dollars and percentages for the performance based acquisition' +
            ' contracts for the specified date range. It also provides drill down capability to view specific report' +
            ' details, including field values for the contract.'
          },
          {
            id: '3F69E8FF471B08F686A986840B30E250',
            name: 'Potential Vendor Anomaly Report',
            app: 'ANOMALY',
            reportType: 'dynamic',
            desc: 'This report displays all the contracts that are marked as Small Business by contracting officer' +
            ' and the contractor is one of the Top 100 Federal Contractors.',
            verb: 'This report has been identified as having anomalies in the entered award data.  Agencies should' +
            ' review the report to confirm the integrity of their data.'
          },
          {
            id: '03DDC6C04986ECFD3B8273B18E40E2E9',
            name: 'Procurement History for Market Research',
            reportType: 'dynamic',
            desc: 'This report provides total dollars awarded to all vendors for a Product and Service Code (PSC)' +
            ' given in the search criteria. The dollars are aggregated by the unique entry reported in the ' +
            'Description of Requirements field.'
          },
          {
            id: 'FED44C46426A02DC9A52A1B5B62EFB1F',
            name: 'Purchase Card as a Payment Method',
            reportType: 'dynamic',
            desc: 'This report displays the procurement actions within a specified date range where the Purchase' +
            ' Card was used/not used as a method of payment.'
          },
          {
            id: 'D5D3504B4B3DB63B7CA64BAC19C82C57',
            name: 'Recycled Content Product Purchasing Data Report',
            reportType: 'dynamic',
            desc: 'The report displays actions and dollars for Product or Service Code (PSC) Categories and how ' +
            'many of them are acquired by Commercial Item procedures at the Federal Government level.'
          },
          {
            id: '6D869CB5461F97594628C8B5468B2287',
            name: 'Small Business Competitiveness Demonstration Program Report',
            reportType: 'dynamic',
            desc: 'The report displays actions and dollars for Product or Service Code (PSC) Categories and how ' +
            'many of them are acquired by Commercial Item procedures at the Federal Government level.'
          },
          {
            id: '5C31085043356E0EA5A6049735A9B03A',
            name: 'Small Business Goaling Report',
            reportType: 'dynamic',
            desc: 'This report displays the dollars, actions, and percentages for small business contracts. The' +
            ' goaling exclusions apply to this report. This report is run by funding agency.'
          },
          {
            id: 'D70B108040683D73AB7D6B8622052D67',
            name: 'Subcontracting Plan report',
            app: 'ANOMALY',
            reportType: 'dynamic',
            desc: 'This report displays "Plan Required - Incentive Not Included", "Plan Required - Incentive' +
            ' Included", "Plan Required (Pre 2004)", "Individual Subcontract Plan", "Commercial Subcontract Plan" ' +
            'or "DOD Comprehensive Subcontract Plan" for base documents.',
            verb: 'This report has been identified as having anomalies in the entered award data.  Agencies ' +
            'should review the report to confirm the integrity of their data.'
          },
          {
            id: '9555AB4F41EAD3556383CB936AADF2AC',
            name: 'Sustainability Report',
            reportType: 'dynamic',
            desc: 'This report displays actions and dollars for the "Recovered Materials/Sustainability" values. ' +
            'Actions with a foreign Place of Performance or a Claimant Program coded as Weapons are excluded ' +
            'from this report.'
          },
          {
            id: '6B11AF1648055A614207B69E659F9AE8',
            name: 'Total Actions by NAICS',
            reportType: 'dynamic',
            desc: 'The report displays actions and dollars for North American Industry Classification System ' +
            '(NAICS) Categories and how many of them are acquired by Commercial Item procedures at the Federal ' +
            'Government level.'
          },
          {
            id: 'DED49FC94E5F54DDDEADBDA5E4CFE8BF',
            name: 'Total Actions by PSC',
            reportType: 'dynamic',
            desc: 'The report displays actions and dollars for Product or Service Code (PSC) Categories and how' +
            ' many of them are acquired by Commercial Item procedures at the Federal Government level.'
          },
          {
            id: '42D7D77D4C317D8F2D2512AB0CFA31FB',
            name: 'Trade Agreements Report',
            reportType: 'dynamic',
            desc: 'The report displays actions and dollars for Product or Service Code (PSC) Categories and how ' +
            'many of them are acquired by Commercial Item procedures at the Federal Government level.'
          },
          {
            id: '765653484A5BD0ECC8C0CBA42AA625E3',
            name: 'Unique Vendors Report',
            app: 'ANOMALY',
            reportType: 'dynamic',
            desc: 'This report reflects the number of Unique Vendors in a given Fiscal Year.',
            verb: 'This report has been identified as having anomalies in the entered award data.  Agencies should ' +
            'review the report to confirm the integrity of their data.'
          }
        ];
      }
      vm.totalReportCount = vm.dbReports.length;
      let sortedArray = vm.dbReports.slice(0);
      sortedArray.sort((first, second): number => {
        if (first.name < second.name) return -1;
        if (first.name > second.name) return 1;
        return 0;
      });
      vm.dbReports = sortedArray;
      vm.getReports();
      cb();
    });
  }
}
