import { Component } from "@angular/core";
import {Location} from '@angular/common';

@Component({
    moduleId: __filename,
    templateUrl: 'revised-sca-template.html'
})

export class WageDeterminationRevisedSCAPage{
    
    constructor(private location: Location){

    }

    // back button
    onBackClick(){
        this.location.back();
    }
    
    scaWageDeterminations = [
        '1992-0334',
        '1994-0761',
        '1994-0764',
        '1995-0051',
        '1995-0077',
        '1995-0079',
        '1995-0080',
        '1995-0082',
        '1995-0090',
        '1995-0091',
        '1995-0122',
        '1995-0263',
        '1995-0279',
        '1995-0308',
        '1995-0344',
        '1995-0348',
        '1995-0361',
        '1995-0367',
        '1995-0378',
        '1995-0410',
        '1995-0495',
        '1995-0515',
        '1995-0561',
        '1995-0573',
        '1995-0574',
        '1995-0579',
        '1995-0584',
        '1995-0587',
        '1995-0596',
        '1995-0601',
        '1995-0607',
        '1995-0608',
        '1995-0611',
        '1995-0615',
        '1995-0621',
        '1995-0623',
        '1995-0631',
        '1995-0644',
        '1995-0646',
        '1995-0674',
        '1995-0688',
        '1995-0690',
        '1995-0714',
        '1995-0717',
        '1995-0719',
        '1995-0721',
        '1995-0723',
        '1995-0738',
        '1995-0751',
        '1995-0752',
        '1995-0761',
        '1995-0765',
        '1995-0766',
        '1995-0780',
        '1995-0811',
        '1995-0812',
        '1995-0814',
        '1995-0815',
        '1995-0819',
        '1995-0823',
        '1995-0825',
        '1995-0827',
        '1995-0831',
        '1995-0833',
        '1995-0839',
        '1995-0847',
        '1996-0034',
        '1996-0045',
        '1996-0049',
        '1996-0061',
        '1996-0062',
        '1996-0063',
        '1996-0067',
        '1996-0076',
        '1996-0077',
        '1996-0078',
        '1996-0080',
        '1996-0081',
        '1996-0082',
        '1996-0083',
        '1996-0084',
        '1996-0086',
        '1996-0087',
        '1996-0088',
        '1996-0091',
        '1996-0092',
        '1996-0104',
        '1996-0105',
        '1996-0106',
        '1996-0107',
        '1996-0108',
        '1996-0124',
        '1996-0130',
        '1996-0131',
        '1996-0135',
        '1996-0136',
        '1996-0140',
        '1996-0141',
        '1996-0145',
        '1996-0146',
        '1996-0154',
        '1996-0163',
        '1996-0185',
        '1996-0239',
        '1996-0248',
        '1996-0251',
        '1996-0259',
        '1996-0260',
        '1996-0266',
        '1996-0271',
        '1996-0272',
        '1996-0273',
        '1996-0277',
        '1996-0280',
        '1996-0281',
        '1996-0283',
        '1996-0287',
        '1996-0305',
        '1996-0310',
        '1996-0320',
        '1996-0321',
        '1996-0347',
        '1996-0357',
        '1996-0358',
        '1996-0411',
        '1996-0412',
        '1996-0455',
        '1996-0473',
        '1997-0002',
        '1997-0006',
        '1997-0022',
        '1997-0025',
        '1997-0026',
        '1997-0027',
        '1997-0029',
        '1997-0030',
        '1997-0055',
        '1997-0056',
        '1997-0073',
        '1997-0079',
        '1997-0083',
        '1997-0118',
        '1997-0166',
        '1997-0242',
        '1997-0243',
        '1997-0244',
        '1997-0245',
        '1997-0246',
        '1997-0247',
        '1997-0248',
        '1997-0250',
        '1997-0300',
        '1997-0321',
        '1998-0156',
        '1998-0174',
        '1998-0202',
        '1998-0205',
        '1998-0208',
        '1998-0220',
        '1998-0221',
        '1998-0222',
        '1998-0223',
        '1998-0226',
        '1998-0227',
        '1998-0294',
        '1998-0299',
        '1998-0379',
        '1998-0587',
        '1998-0604',
        '1998-0614',
        '1998-0626',
        '1998-0727',
        '1999-0025',
        '1999-0068',
        '1999-0069',
        '1999-0070',
        '1999-0229',
        '1999-0266',
        '1999-0469',
        '1999-0538',
        '2001-0032',
        '2003-0409',
        '2017-0578'    
    ]
}
