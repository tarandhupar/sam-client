import { ViewChangesPipe } from "./view-changes.pipe";

describe('ViewChangesPipe', () => {
  let pipe = new ViewChangesPipe();
  let dictionaries = {"_embedded": {
    "dictionaries":[{
    "elements":[
      {
        "elementId": "7",
        "description": null,
        "value": "Total Small Business",
        "elements": null
      }
    ], "id": "set_aside_type"},{
    "elements": [
      {
        "elementId": "14",
        "description": null,
        "elements": null,
        "value": "24 -- Tractors"
      }
    ], "id": "classification_code"},
      {"elements": [
      {
        "elementId": "0091009",
        "description": null,
        "elements": null,
        "value": "336212 -- Truck Trailer Manufacturing",
      }
    ], "id": "naics_code"}
  ]}};
  let currentOpportunity = {
    "opportunityId": "18741f085fce49fe2c523499e513bbde",
    "data": {
      "type": "m",
      "solicitationNumber": "USAFA-BAA-2009-1",
      "title": "Research Interests of the US Air Force Academy",
      "organizationId": "6ffb0f4a5d91d8f3771eee10388b3dc6",
      "organizationLocationId": "c6b2881913de70250d88c8393ae7e35a",
      "statuses": {
        "publishStatus": "published",
        "isArchived": false,
        "isCanceled": false
      },
      "descriptions": [
        {
          "descriptionId": "f804f07655a594a98ee87bcedf11107d",
          "content": "<p>29 May 2014: Please ensure white papers and/or proposals are submitted in accordance with Amendment 0005 of the USAFA BAA-2009-1, which is also available on the Grants.gov website. The updated BAA found on Grants.gov is the conformed version of the announcement.</p>"
        }
      ],
      "link": {
        "additionalInfo": {}
      },
      "classificationCode": "79",
      "naicsCode": [
        "0220065"
      ],
      "isRecoveryRelated": false,
      "isScheduleOpportunity": false,
      "pointOfContact": [
        {
          "type": "primary",
          "title": "Contracting Officer",
          "fullName": "Mara A. Strobel",
          "email": "mara.strobel@us.af.mil",
          "phone": "719-333-4899",
          "fax": "4444444444",
          "additionalInfo": {}
        },
        {
          "type": "secondary",
          "title": "Officer",
          "fullName": "Shawna L. Bowshot",
          "email": "shawna.bowshot@us.af.mil",
          "phone": "7193334595",
          "fax": "5555555",
          "additionalInfo": {}
        }
      ],
      "placeOfPerformance": {
        "streetAddress": "8110 Industrial Drive, STE 200",
        "streetAddress2": "",
        "city": "US Air Force Academy",
        "state": "CO",
        "zip": "80840",
        "country": "US"
      },
      "archive": {
        "type": "manual",
        "date": "2015-02-13 00:00:00"
      },
      "permissions": {
        "area": {}
      },
      "solicitation": {
        "setAside": "14",
        "deadlines": {
          "response": "2019-09-29 16:30:00-06:00"
        }
      },
      "award": {
        "date": "2013-10-02",
        "number": "DJBTDAT312",
        "amount": "$ 2,156,181.00",
        "lineItemNumber": "Not All",
        "deliveryOrderNumber": "1",
        "awardee": {
          "name": "Apple Street Health Services",
          "duns": "501136417",
          "location": {
            "streetAddress": "200 Cherry Street, S.E.",
            "streetAddress2": "",
            "city": "Chicago",
            "state": "IL",
            "zip": "49505",
            "country": "US"
          }
        },
        "justificationAuthority": {},
        "fairOpportunity": {}
      }
    },
    "parent": {
      "opportunityId": "fd9708f421ff79b551551225fd052138"
    },
    "latest": true,
    "postedDate": "2014-05-29 16:57:57",
    "modifiedDate": "2014-05-29 16:57:57",
    "_links": {
      "self": {
        "href": "https://gsaiae-dev02.reisys.com/opps/v1/opportunities/18741f085fce49fe2c523499e513bbde"
      },
      "attachments": {
        "href": "https://gsaiae-dev02.reisys.com/opps/v1/opportunities/18741f085fce49fe2c523499e513bbde/attachments"
      }
    }
  };

  let previousOpportunity = {
    "opportunityId": "135c345433f087e5dbccf0879bc00eef",
    "data": {
      "type": "m",
      "solicitationNumber": "USAFA-BAA-2009-1",
      "title": "Research Interests of the US Air Force Academy",
      "organizationId": "6ffb0f4a5d91d8f3771eee10388b3dc6",
      "organizationLocationId": "7ba10b80b8c45286e088f43e1bd6ccb4",
      "statuses": {
        "publishStatus": "published",
        "isArchived": false,
        "isCanceled": false
      },
      "descriptions": [
        {
          "descriptionId": "2f57ee733a67e320ae6ff8b905c3fa99",
          "content": "See Attachment"
        }
      ],
      "link": {
        "additionalInfo": {}
      },
      "classificationCode": "14",
      "naicsCode": [
        "0091009"
      ],
      "isRecoveryRelated": true,
      "isScheduleOpportunity": false,
      "pointOfContact": [
        {
          "type": "primary",
          "title": "Specialist",
          "fullName": "Warren ACC IDQ",
          "email": "usarmy.detroit.acc.mbx.wrn-idq@mail.mil",
          "phone": "0000000000",
          "fax": "1111111111",
          "additionalInfo": {}
        },
        {
          "type": "secondary",
          "title": "Contract Specialist",
          "fullName": "Marta Furman",
          "email": "marta.furman.civ@mail.mil",
          "phone": "2222222222",
          "fax": "3333333333",
          "additionalInfo": {}
        }
      ],
      "placeOfPerformance": {
        "streetAddress": "8110 Industrial Drive, STE 2002",
        "streetAddress2": "",
        "city": "Scranton",
        "state": "PA",
        "zip": "23123",
        "country": "CA"
      },
      "archive": {
        "type": "autocustom",
        "date": "2015-02-14 00:00:00"
      },
      "permissions": {
        "area": {}
      },
      "solicitation": {
        "setAside": "7",
        "deadlines": {
          "response": "2014-09-30 16:30:00-06:00"
        }
      },
      "award": {
        "date": "2013-10-01",
        "number": "DJBTDAT311",
        "amount": "$ 1,156,181.00",
        "deliveryOrderNumber": "2",
        "lineItemNumber": "All",
        "awardee": {
          "name": "Cherry Street Health Services",
          "duns": "603136417",
          "location": {
            "streetAddress": "100 Cherry Street, S.E.",
            "streetAddress2": "",
            "city": "Grand Rapids",
            "state": "MI",
            "zip": "49503",
            "country": "US"
          }
        },
        "justificationAuthority": {},
        "fairOpportunity": {}
      }
    },
    "parent": {
      "opportunityId": "fd9708f421ff79b551551225fd052138"
    },
    "latest": false,
    "postedDate": "2014-04-30 15:03:12",
    "modifiedDate": "2014-04-30 15:03:12",
    "_links": {
      "self": {
        "href": "https://gsaiae-dev02.reisys.com/opps/v1/opportunities/135c345433f087e5dbccf0879bc00eef"
      },
      "attachments": {
        "href": "https://gsaiae-dev02.reisys.com/opps/v1/opportunities/135c345433f087e5dbccf0879bc00eef/attachments"
      }
    }
  };

  let currentAddress = {
    "zip": "20528",
    "street": "Office of the Chief Procurement Officer",
    "state": "DC",
    "country": "US",
    "city": "Washington"
  };

  let previousAddress1 = {
    "zip": "20520",
    "street": "Not Office of the Chief Procurement Officer",
    "state": "BC",
    "country": "Canada",
    "city": "Vancouver"
  };

  let differences2 = {
    primaryFullName: '<strike>Warren ACC IDQ</strike>',
    primaryTitle: '<strike>Specialist</strike>',
    primaryEmail: '<strike>usarmy.detroit.acc.mbx.wrn-idq@mail.mil</strike>',
    primaryPhone: '<strike>0000000000</strike>',
    primaryFax: '<strike>1111111111</strike>',
    secondaryFullName: '<strike>Marta Furman</strike>',
    secondaryTitle: '<strike>Contract Specialist</strike>',
    secondaryEmail: '<strike>marta.furman.civ@mail.mil</strike>',
    secondaryPhone: '<strike>2222222222</strike>',
    secondaryFax: '<strike>3333333333</strike>',
    changesExistGeneral: true,
    changesExistSynopsis: true,
    changesExistClassification:true,
    changesExistContactInformation: true,
    changesExistAwardDetails: true,
    awardDate: '<strike>Oct 01, 2013</strike>',
    awardNumber:'<strike>DJBTDAT311</strike>',
    orderNumber: '<strike>2</strike>',
    awardedDuns: '<strike>603136417</strike>',
    awardedName: '<strike>Cherry Street Health Services</strike>',
    awardedAddress: '<strike>100 Cherry Street, S.E. Grand Rapids, MI US 49503</strike>',
    awardAmount: '<strike>$ 1,156,181.00</strike>',
    lineItemNumber: '<strike>All</strike>',
    updateResponseDate: '<strike>Sep 30, 2014</strike>',
    archivingPolicy: '<strike>Automatic, on specified date</strike>',
    updateArchiveDate: '<strike>Feb 14, 2015</strike>',
    specialLegislation: '<strike>Recovery and Reinvestment Act</strike>',
    updateSetAside: '<strike>Total Small Business</strike>',
    classificationCode: '<strike>24 -- Tractors</strike>',
    naicsCode: '<strike>336212 -- Truck Trailer Manufacturing</strike>',
    placeOfPerformance: '<strike>8110 Industrial Drive, STE 2002 Scranton, PA CA 23123</strike>',
    contractingOfficeAddress: '<strike>Not Office of the Chief Procurement Officer Vancouver BC Canada 20852</strike>',
    primaryPointOfContact: true,
    secondaryPointOfContact: true,
    description: '<strike>See Attachment</strike><u><p>29 May 2014: Please ensure white papers and/or proposals are submitted in accordance with Amendment 0005 of the USAFA BAA-2009-1, which is also available on the Grants.gov website. The updated BAA found on Grants.gov is the conformed version of the announcement.</p></u>',
    postedDate: 'Changes from 04/30/2014 3:03 pm'
  };


  it('transforms "multiple objects from API calls to one with that contains changes to be displayed (Update)', () => {
    let results = pipe.transform(previousOpportunity, currentOpportunity, dictionaries, currentAddress, previousAddress1);
    expect(results.changesExistGeneral).toBe(differences2.changesExistGeneral);
    expect(results.changesExistClassification).toBe(differences2.changesExistClassification);
    expect(results.changesExistContactInformation).toBe(differences2.changesExistContactInformation);
    expect(results.changesExistAwardDetails).toBe(differences2.changesExistAwardDetails);
    expect(results.changesExistSynopsis).toBe(differences2.changesExistSynopsis);
    expect(results.updateResponseDate).toBe(differences2.updateResponseDate);
    expect(results.archivingPolicy).toBe(differences2.archivingPolicy);
    expect(results.updateArchiveDate).toBe(differences2.updateArchiveDate);
    expect(results.specialLegislation).toBe(differences2.specialLegislation);
    expect(results.updateSetAside).toBe(differences2.updateSetAside);
    expect(results.classificationCode).toBe(differences2.classificationCode);
    expect(results.naicsCode).toBe(differences2.naicsCode);
    expect(results.placeOfPerformance).toBe(differences2.placeOfPerformance);
    expect(results.description).toBe(differences2.description);
    expect(results.postedDate).toBe(differences2.postedDate);
    expect(results.awardDate).toBe(differences2.awardDate);
    expect(results.awardNumber).toBe(differences2.awardNumber);
    expect(results.orderNumber).toBe(differences2.orderNumber);
    expect(results.awardedDuns).toBe(differences2.awardedDuns);
    expect(results.awardedName).toBe(differences2.awardedName);
    expect(results.awardAmount).toBe(differences2.awardAmount);
    expect(results.awardedAddress).toBe(differences2.awardedAddress);
    expect(results.primaryFullName).toBe(differences2.primaryFullName);
    expect(results.primaryTitle).toBe(differences2.primaryTitle);
    expect(results.primaryEmail).toBe(differences2.primaryEmail);
    expect(results.primaryPhone).toBe(differences2.primaryPhone);
    expect(results.primaryFax).toBe(differences2.primaryFax);
    expect(results.secondaryFullName).toBe(differences2.secondaryFullName);
    expect(results.secondaryTitle).toBe(differences2.secondaryTitle);
    expect(results.secondaryEmail).toBe(differences2.secondaryEmail);
    expect(results.secondaryPhone).toBe(differences2.secondaryPhone);
    expect(results.secondaryFax).toBe(differences2.secondaryFax);
  });

});
