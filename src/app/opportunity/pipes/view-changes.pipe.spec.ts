import { ViewChangesPipe } from "./view-changes.pipe";

describe('ViewChangesPipe', () => {
  let pipe = new ViewChangesPipe();
  let dictionaries = {
    "set_aside_type":[
      {
        "element_id": "7",
        "description": null,
        "parent_element_id": null,
        "value": "Total Small Business",
        "dictionary_name": "set_aside_type",
        "code": "7",
        "sort_index": "70"
      }
    ],
    "classification_code": [
      {
        "element_id": "14",
        "description": null,
        "parent_element_id": null,
        "value": "24 -- Tractors",
        "dictionary_name": "classification_code",
        "code": "24",
        "sort_index": "14"
      }
    ],
    "naics_code": [
      {
        "element_id": "0091009",
        "description": null,
        "parent_element_id": "0091",
        "value": "336212 -- Truck Trailer Manufacturing",
        "dictionary_name": "naics_code",
        "code": "336212",
        "sort_index": "25"
      }
    ]
  };
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
          "content": "<p>29 May 2014: Please ensure white papers and/or proposals are submitted in accordance with Amendment 0005 of the USAFA BAA-2009-1, which is also available on the Grants.gov website. The updated BAA found on Grants.gov is the conformed version of the announcement.</p>\r\n<p>&nbsp;</p>\r\n<p>&nbsp;</p>\r\n<p>&nbsp;</p>"
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
          "additionalInfo": {}
        },
        {
          "type": "secondary",
          "title": "Contracting Officer",
          "fullName": "Shawna L. Bowshot",
          "email": "shawna.bowshot@us.af.mil",
          "phone": "7193334595",
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
        "awardee": {
          "location": {
            "streetAddress2": ""
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
          "title": "Contracting Officer",
          "fullName": "Mara A. Strobel",
          "email": "mara.strobel@us.af.mil",
          "phone": "719-333-4899",
          "additionalInfo": {}
        },
        {
          "type": "secondary",
          "title": "Contracting Officer",
          "fullName": "Shawna L. Bowshot",
          "email": "shawna.bowshot@us.af.mil",
          "phone": "7193334595",
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
        "awardee": {
          "location": {
            "streetAddress2": ""
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

  // let differences1 = {
  //   changesExist: changesExist,
  //   updateResponseDate: updateResponseDate,
  //   archivingPolicy: archivingPolicy,
  //   updateArchiveDate: updateArchiveDate,
  //   specialLegislation: specialLegislation,
  //   updateSetAside: updateSetAside,
  //   classificationCode: classificationCode,
  //   naicsCode: naicsCode,
  //   placeOfPerformance: placeOfPerformance,
  //   description: description,
  //   contractingOfficeAddress: contractingOfficeAddress,
  //   primaryPointOfContact: primaryPointOfContact,
  //   secondaryPointOfContact: secondaryPointOfContact,
  //   postedDate: postedDate
  // };

  let differences2 = {
    changesExistGeneral: true,
    changesExistSynopsis: true,
    updateResponseDate: "<strike>Sep 30, 2014</strike>",
    archivingPolicy: "<strike>Automatic, on specified date</strike>",
    updateArchiveDate: "<strike>Feb 14, 2015</strike>",
    specialLegislation: "<strike>Recovery and Reinvestment Act</strike>",
    updateSetAside: "<strike>Total Small Business</strike>",
    classificationCode: "<strike>24 -- Tractors</strike>",
    naicsCode: "<strike>336212 -- Truck Trailer Manufacturing</strike>",
    placeOfPerformance: "<strike>8110 Industrial Drive, STE 2002 Scranton PA CA 23123</strike>",
    description: "<strike>See Attachment</strike>",
    postedDate: "04/30/2014 3:03 pm"
  };

  let previousAddress2 = null;

  it('transforms "multiple objects from API calls to one with that contains changes to be displayed (Update)', () => {
    let results = pipe.transform(previousOpportunity, currentOpportunity, dictionaries, currentAddress, previousAddress1);
    expect(results.changesExistGeneral).toBe(differences2.changesExistGeneral);
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
  });

  // it('transforms "multiple objects from API calls to one with that contains changes to be displayed (New Data)', () => {
  //   expect(pipe.transform('UTC-10:00')).toBe('Hawaii');
  // });

});
