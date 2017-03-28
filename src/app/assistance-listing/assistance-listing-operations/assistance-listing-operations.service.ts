import {Injectable} from '@angular/core';
import { SidenavService } from "sam-ui-kit/components/sidenav/services/sidenav.service";
import { ActivatedRoute } from '@angular/router';
import * as Cookies from 'js-cookie';

@Injectable()

export class FALOpSharedService{

  baseURL : string;
  programId: string;
  sidenavModel = {};
  cookieValue: string;

  constructor(private sidenavService: SidenavService, private route: ActivatedRoute){

    if(!this.cookieValue)
      this.cookieValue = Cookies.get('iPlanetDirectoryPro');
  }

  getSideNavModel(){

    if(this.route.snapshot.params['id']){
      this.programId = this.route.snapshot.params['id'];
      this.baseURL = "programs/" + this.route.snapshot.params['id'] + "/edit";
    }
    else {
      this.baseURL = "programs/add";
    }

    this.sidenavModel = {
      label: "Assistance Listings",
        children: [
      {
        label: "Header Information",
        route: this.baseURL + '/header-information',
        path: 'header-information'
      },
      {
        label: "Overview",
        route: this.baseURL + '/overview',
        path: 'overview'
      },
      {
        label: "Financial Information",
        route: this.baseURL + '/financial-information',
        path: 'financial-information',
        children:[
          {
            label: "Obligations",
            route: '/obligations',
            path: 'obligations'
          },
          {
            label: "Other Financial Info",
            route: '/other-financial-info',
            path: 'other-financial-info'
          }
        ]
      },
      {
        label : "Contact Information",
        route: this.baseURL + "/contact-information",
        path: "contact-information"
      }
    ]
    };

    return this.sidenavModel;
  }

  setSideNavFocus(){

    let grandChildPath : string;
    let childPath = this.route.snapshot.children[0].url[0].path;

    if(this.route.snapshot.children[0].url.length > 1){
      grandChildPath = this.route.snapshot.children[0].url[1].path;
    }

    for(let child of this.sidenavModel['children']) {
      if(child.path == childPath) {
        this.sidenavService.updateData(0, this.sidenavModel['children'].indexOf(child));
        if(child['children']) {
          for (let grandChild of child['children']) {
            if (grandChild.path == grandChildPath) {
              this.sidenavService.updateData(1, child['children'].indexOf(grandChild));
            }
          }//end of grandchild for
        }
      }
    }//end of child for

  }

  selectedItem(item){
    return this.sidenavService.getData()[0];
  }

  getCountries(){

    return {
      ['US'] : 'United States of America',
      ['CA'] : 'Canada',
      ['AF'] : 'Afghanistan',
      ['AX'] : 'Åland',
      ['AL'] : 'Albania',
      ['DZ'] : 'Algeria',
      ['AS'] : 'American Samoa',
      ['AD'] : 'Andorra',
      ['AO'] : 'Angola',
      ['AI'] : 'Anguilla',
      ['AQ'] : 'Antarctica',
      ['AG'] : 'Antigua and Barbuda',
      ['AR'] : 'Argentina',
      ['AM'] : 'Armenia',
      ['AW'] : 'Aruba',
      ['AU'] : 'Australia',
      ['AT'] : 'Austria',
      ['AZ'] : 'Azerbaijan',
      ['BS'] : 'Bahamas',
      ['BH'] : 'Bahrain',
      ['BD'] : 'Bangladesh',
      ['BB'] : 'Barbados',
      ['BY'] : 'Belarus',
      ['BE'] : 'Belgium',
      ['BZ'] : 'Belize',
      ['BJ'] : 'Benin',
      ['BM'] : 'Bermuda',
      ['BT'] : 'Bhutan',
      ['BO'] : 'Bolivia',
      ['BA'] : 'Bosnia and Herzegovina',
      ['BW'] : 'Botswana',
      ['BV'] : 'Bouvet Island',
      ['BR'] : 'Brazil',
      ['IO'] : 'British Indian Ocean Territory',
      ['BN'] : 'Brunei Darussalam',
      ['BG'] : 'Bulgaria',
      ['BF'] : 'Burkina Faso',
      ['BI'] : 'Burundi',
      ['KH'] : 'Cambodia',
      ['CM'] : 'Cameroon',
      ['CV'] : 'Cape Verde',
      ['KY'] : 'Cayman Islands',
      ['CF'] : 'Central African Republic',
      ['TD'] : 'Chad',
      ['CL'] : 'Chile',
      ['CN'] : 'China',
      ['CX'] : 'Christmas Island',
      ['CC'] : 'Cocos (Keeling) Islands',
      ['CO'] : 'Colombia',
      ['KM'] : 'Comoros',
      ['CG'] : 'Congo (Brazzaville)',
      ['CD'] : 'Congo (Kinshasa)',
      ['CK'] : 'Cook Islands',
      ['CR'] : 'Costa Rica',
      ['CI'] : 'Côte dIvoire',
      ['HR'] : 'Croatia',
      ['CU'] : 'Cuba',
      ['CY'] : 'Cyprus',
      ['CZ'] : 'Czech Republic',
      ['DK'] : 'Denmark',
      ['DJ'] : 'Djibouti',
      ['DM'] : 'Dominica',
      ['DO'] : 'Dominican Republic',
      ['EC'] : 'Ecuador',
      ['EG'] : 'Egypt',
      ['SV'] : 'El Salvador',
      ['GQ'] : 'Equatorial Guinea',
      ['ER'] : 'Eritrea',
      ['EE'] : 'Estonia',
      ['ET'] : 'Ethiopia',
      ['FK'] : 'Falkland Islands',
      ['FO'] : 'Faroe Islands',
      ['FJ'] : 'Fiji',
      ['FI'] : 'Finland',
      ['FR'] : 'France',
      ['GF'] : 'French Guiana',
      ['PF'] : 'French Polynesia',
      ['TF'] : 'French Southern Lands',
      ['GA'] : 'Gabon',
      ['GM'] : 'Gambia',
      ['GE'] : 'Georgia',
      ['DE'] : 'Germany',
      ['GH'] : 'Ghana',
      ['GI'] : 'Gibraltar',
      ['GR'] : 'Greece',
      ['GL'] : 'Greenland',
      ['GD'] : 'Grenada',
      ['GP'] : 'Guadeloupe',
      ['GU'] : 'Guam',
      ['GT'] : 'Guatemala',
      ['GG'] : 'Guernsey',
      ['GN'] : 'Guinea',
      ['GW'] : 'Guinea-Bissau',
      ['GY'] : 'Guyana',
      ['HT'] : 'Haiti',
      ['HM'] : 'Heard and McDonald Islands',
      ['HN'] : 'Honduras',
      ['HK'] : 'Hong Kong',
      ['HU'] : 'Hungary',
      ['IS'] : 'Iceland',
      ['IN'] : 'India',
      ['ID'] : 'Indonesia',
      ['IR'] : 'Iran',
      ['IQ'] : 'Iraq',
      ['IE'] : 'Ireland',
      ['IM'] : 'Isle of Man',
      ['IL'] : 'Israel',
      ['IT'] : 'Italy',
      ['JM'] : 'Jamaica',
      ['JP'] : 'Japan',
      ['JE'] : 'Jersey',
      ['JO'] : 'Jordan',
      ['KZ'] : 'Kazakhstan',
      ['KE'] : 'Kenya',
      ['KI'] : 'Kiribati',
      ['KP'] : 'Korea ( North )',
      ['KR'] : 'Korea ( South )',
      ['KW'] : 'Kuwait',
      ['KG'] : 'Kyrgyzstan',
      ['LA'] : 'Laos',
      ['LV'] : 'Latvia',
      ['LB'] : 'Lebanon',
      ['LS'] : 'Lesotho',
      ['LR'] : 'Liberia',
      ['LY'] : 'Libya',
      ['LI'] : 'Liechtenstein',
      ['LT'] : 'Lithuania',
      ['LU'] : 'Luxembourg',
      ['MO'] : 'Macau',
      ['MK'] : 'Macedonia',
      ['MG'] : 'Madagascar',
      ['MW'] : 'Malawi',
      ['MY'] : 'Malaysia',
      ['MV'] : 'Maldives',
      ['ML'] : 'Mali',
      ['MT'] : 'Malta',
      ['MH'] : 'Marshall Islands',
      ['MQ'] : 'Martinique',
      ['MR'] : 'Mauritania',
      ['MU'] : 'Mauritius',
      ['YT'] : 'Mayotte',
      ['MX'] : 'Mexico',
      ['FM'] : 'Micronesia',
      ['MD'] : 'Moldova',
      ['MC'] : 'Monaco',
      ['MN'] : 'Mongolia',
      ['ME'] : 'Montenegro',
      ['MS'] : 'Montserrat',
      ['MA'] : 'Morocco',
      ['MZ'] : 'Mozambique',
      ['MM'] : 'Myanmar',
      ['NA'] : 'Namibia',
      ['NR'] : 'Nauru',
      ['NP'] : 'Nepal',
      ['NL'] : 'Netherlands',
      ['AN'] : 'Netherlands Antilles',
      ['NC'] : 'New Caledonia',
      ['NZ'] : 'New Zealand',
      ['NI'] : 'Nicaragua',
      ['NE'] : 'Niger',
      ['NG'] : 'Nigeria',
      ['NU'] : 'Niue',
      ['NF'] : 'Norfolk Island',
      ['MP'] : 'Northern Mariana Islands',
      ['NO'] : 'Norway',
      ['OM'] : 'Oman',
      ['PK'] : 'Pakistan',
      ['PW'] : 'Palau',
      ['PS'] : 'Palestine',
      ['PA'] : 'Panama',
      ['PG'] : 'Papua New Guinea',
      ['PY'] : 'Paraguay',
      ['PE'] : 'Peru',
      ['PH'] : 'Philippines',
      ['PN'] : 'Pitcairn',
      ['PL'] : 'Poland',
      ['PT'] : 'Portugal',
      ['PR'] : 'Puerto Rico',
      ['QA'] : 'Qatar',
      ['RE'] : 'Reunion',
      ['RO'] : 'Romania',
      ['RU'] : 'Russian Federation',
      ['RW'] : 'Rwanda',
      ['BL'] : 'Saint Barthélemy',
      ['SH'] : 'Saint Helena',
      ['KN'] : 'Saint Kitts and Nevis',
      ['LC'] : 'Saint Lucia',
      ['MF'] : 'Saint Martin (French part)',
      ['PM'] : 'Saint Pierre and Miquelon',
      ['VC'] : 'Saint Vincent and the Grenadines',
      ['WS'] : 'Samoa',
      ['SM'] : 'San Marino',
      ['ST'] : 'Sao Tome and Principe',
      ['SA'] : 'Saudi Arabia',
      ['SN'] : 'Senegal',
      ['RS'] : 'Serbia',
      ['SC'] : 'Seychelles',
      ['SL'] : 'Sierra Leone',
      ['SG'] : 'Singapore',
      ['SK'] : 'Slovakia',
      ['SI'] : 'Slovenia',
      ['SB'] : 'Solomon Islands',
      ['SO'] : 'Somalia',
      ['ZA'] : 'South Africa',
      ['GS'] : 'South Georgia and South Sandwich Islands',
      ['ES'] : 'Spain',
      ['LK'] : 'Sri Lanka',
      ['SD'] : 'Sudan',
      ['SR'] : 'Suriname',
      ['SJ'] : 'Svalbard and Jan Mayen Islands',
      ['SZ'] : 'Swaziland',
      ['SE'] : 'Sweden',
      ['CH'] : 'Switzerland',
      ['SY'] : 'Syria',
      ['TW'] : 'Taiwan',
      ['TJ'] : 'Tajikistan',
      ['TZ'] : 'Tanzania',
      ['TH'] : 'Thailand',
      ['TL'] : 'Timor-Leste',
      ['TG'] : 'Togo',
      ['TK'] : 'Tokelau',
      ['TO'] : 'Tonga',
      ['TT'] : 'Trinidad and Tobago',
      ['TN'] : 'Tunisia',
      ['TR'] : 'Turkey',
      ['TM'] : 'Turkmenistan',
      ['TC'] : 'Turks and Caicos Islands',
      ['TV'] : 'Tuvalu',
      ['UG'] : 'Uganda',
      ['UA'] : 'Ukraine',
      ['AE'] : 'United Arab Emirates',
      ['GB'] : 'United Kingdom',
      ['UM'] : 'United States Minor Outlying Islands',
      ['UY'] : 'Uruguay',
      ['UZ'] : 'Uzbekistan',
      ['VU'] : 'Vanuatu',
      ['VA'] : 'Vatican City',
      ['VE'] : 'Venezuela',
      ['VN'] : 'Vietnam',
      ['VG'] : 'Virgin Islands ( British )',
      ['VI'] : 'Virgin Islands ( U.S. )',
      ['WF'] : 'Wallis and Futuna Islands',
      ['EH'] : 'Western Sahara',
      ['YE'] : 'Yemen',
      ['ZM'] : 'Zambia',
      ['ZW'] : 'Zimbabwe'
    };

  }

  getStates(){
    return {
      ['AK']: 'Alaska',
      ['AL'] : 'Alabama',
      ['AR'] : 'Arkansas',
      ['AS'] : 'American Samoa',
      ['AZ'] : 'Arizona',
      ['CA'] : 'California',
      ['CO'] : 'Colorado',
      ['CT'] : 'Connecticut',
      ['DC'] : 'District of Columbia',
      ['DE'] : 'Delaware',
      ['FL'] : 'Florida',
      ['GA'] : 'Georgia',
      ['GU'] : 'Guam',
      ['HI'] : 'Hawaii',
      ['IA'] : 'Iowa',
      ['ID'] : 'Idaho',
      ['IL'] : 'Illinois',
      ['IN'] : 'Indiana',
      ['KS'] : 'Kansas',
      ['KY'] : 'Kentucky',
      ['LA'] : 'Louisiana',
      ['MA'] : 'Massachusetts',
      ['MD'] : 'Maryland',
      ['ME'] : 'Maine',
      ['MI'] : 'Michigan',
      ['MN'] : 'Minnesota',
      ['MO'] : 'Missouri',
      ['MS'] : 'Mississippi',
      ['MT'] : 'Montana',
      ['NE'] : 'Nebraska',
      ['NH'] : 'New Hampshire',
      ['NJ'] : 'New Jersey',
      ['NM'] : 'New Mexico',
      ['NV'] : 'Nevada',
      ['NY'] : 'New York',
      ['NC'] : 'North Carolina',
      ['ND'] : 'North Dakota',
      ['MP'] : 'Northern Mariana Islands',
      ['OH'] : 'Ohio',
      ['OK'] : 'Oklahoma',
      ['OR'] : 'Oregon',
      ['PA'] : 'Pennsylvania',
      ['PR'] : 'Puerto Rico',
      ['RI'] : 'Rhode Island',
      ['SC'] : 'South Carolina',
      ['SD'] : 'South Dakota',
      ['TN'] : 'Tennessee',
      ['TX'] : 'Texas',
      ['UM'] : 'United States Minor Outlying Islands',
      ['UT'] : 'Utah',
      ['VA'] : 'Virginia',
      ['VI'] : 'Virgin Islands',
      ['VT'] : 'Vermont',
      ['WA'] : 'Washington',
      ['WI'] : 'Wisconsin',
      ['WV'] : 'West Virginia',
      ['WY'] : 'Wyoming'
    };
  }

}
