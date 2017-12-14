import { merge } from 'lodash';
import * as moment from 'moment';
import { User } from '../user';

import {
  CWSApplication,
  System,
  User as IUser,
} from '../../../interfaces'

function getRandomNumber(min: number = 0, max: number = 10) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getMockUser(): IUser {
  const answer = '        ';

  return merge(User.getCache(), {
    _id: 'doe.john@gsa.gov',
    email: 'doe.john@gsa.gov',

    middleName: 'J',
    firstName: 'John',
    initials: 'J',
    lastName: 'Doe',
    suffix: 'Jr.',

    personalPhone: '2401234568',
    workPhone: '12401234568',
    carrier: 'AT&T',

    departmentID: 100006688,
    agencyID: 100141921,
    officeID: 100170334,

    kbaAnswerList: [
      { questionId: 1, answer: answer },
      { questionId: 3, answer: answer },
      { questionId: 5, answer: answer }
    ],

    emailNotification: false,

    _links: {
      self: {
        href: '/comp/iam/auth/v4/session'
      },

      'system-accounts.manager': {
        href: '/comp/iam/cws/api/system-accounts',
      },

      'system-accounts.migration': {
        href: '/comp/iam/import/system-accounts',
      },

      'system-accounts.admin': {
        href: '/comp/iam/cws/api/system-accounts',
      },

      'security.approver': {
        href: '/comp/iam/cws/api/system-accounts',
      },

      'fsd.profile': {
        href: '/comp/iam/auth/v4/fsd/users/doe.john@gsa.gov',
        templated: true,
      },

      'fsd.kba': {
        href: '/comp/iam/kba/fsd/qa/doe.john@gsa.gov',
        templated: true
      },

      'fsd.deactivate': {
        href: '/comp/iam/my-details/api/fsd/doe.john@gsa.gov/deactivate',
        templated: true
      },

      'fsd.passreset': {
        href: '/comp/iam/password/api/fsd/doe.john@gsa.gov/passwordReset',
        templated: true
      }
    }
  });
};

export function getMockCWSApplication(index: number|string = 1): CWSApplication {
  const types = ['Gov','Non-Gov'];
  const today = moment().valueOf();

  return {
    uid: index,
    systemAccountName: `System Account Mock #${index}`,
    interfacingSystemName: '1,1,0,0,0',
    interfacingSystemVersion: '1.0',
    systemDescriptionAndFunction: `System Account application Mock #${index}`,
    departmentOrgId: '100006688',
    agencyOrgId: '',
    officeOrgId: '',
    systemAdmins: '['+
                    '{"id":1,"accountClaimed":true,"commonName":"Kristin Wight","givenName":"Kristin","mail":"test@test.com","agencyID":100186663,"passwordResetInfo":"0:1496929225932:0:0","surName":"Wight","telephoneNumber":"1+(703)919-4503","uid":"kristin.wight@gsa.gov"},'+
                    '{"id":3,"accountClaimed":true,"commonName":"Hassan Riaz","departmentID":"100006688","givenName":"Hassan","mail":"user5743@test.com","agencyID":100038056,"passwordResetInfo":"0:1494437307857:0:0","surName":"Riaz","telephoneNumber":"1+(123)456-7890","uid":"hassan.riaz@gsa.gov"}'+
                  ']',
    systemManagers: '[]',
    contractOpportunities: 'read,read-sensitive',
    contractData: 'dod-data',
    entityInformation: 'read-public,read-sensitive',
    fips199Categorization: 'Medium',
    ipAddress: '',
    typeOfConnection: 'SFTP',
    physicalLocation: '',
    securityOfficialName: '',
    securityOfficialEmail: '',
    uploadAto: '',
    authorizationConfirmation: true,
    authorizingOfficialName: 'John Doe',
    authorizationDate: today,
    lastUpdate: today,
    submittedBy: '',
    submittedDate: today,
    securityApprover: '',
    securityApproved_Date: '',
    dateOfRejection: '',
    rejectedBy: '',
    rejectionReason: '',
    applicationStatus: 'Draft',
  };
}

export function getMockCWSComments(index: number) {
  return [
    { id: 0, applicationUID: index, comment: `test comment ${index++}`, user: 'Jonathan Givens' },
    { id: 1, applicationUID: index, comment: `test comment ${index++}`, user: 'Jonathan Givens' },
    { id: 2, applicationUID: index, comment: `test comment ${index++}`, user: 'Jonathan Givens' },
    { id: 3, applicationUID: index, comment: `test comment ${index++}`, user: 'Jonathan Givens' }
  ]
}

export function getMockCWSSummary() {
  return {
    pending: getRandomNumber(0, 10),
    approved: getRandomNumber(0, 30),
    rejected: getRandomNumber(0, 5),
    cancelled: getRandomNumber(0, 5),
  }
}

export function getMockSystemAccount(index): System {
  const types = ['Gov','Non-Gov'];

  index = index || 1;

  return {
    _id:               `system-email-${index}@email.com`,
    email:             `system-email-${index}@email.com`,
    systemType:        types[Math.random()],
    systemName:        `System-Account-${index}`,
    systemDescription: `System-Account-${index} description`,
    ipAddress:         `System-Account-${index}`,

    comments:          'System comments...',
    duns:              'Test Duns',
    businessName:      'John Doe Inc.',
    businessAddress:   '1600 Pennsylvania Ave NW, Washington DC 20500',
    department:        100006688,
    primaryOwnerName:  `Primary Owner Name ${index}`,
    primaryOwnerEmail: `primary-owner-email-${index}@email.com`,

    pointOfContact: [
      'chiukk1@gmail.com',
      'chiu_kevin@bah.com',
    ]
  };
};

export function getMockKBAQuestions() {
  return [
    { 'id': 1,  'question': 'What was the make and model of your first car?' },
    { 'id': 2,  'question': 'Who is your favorite Actor/Actress?' },
    { 'id': 3,  'question': 'What was your high school mascot?' },
    { 'id': 4,  'question': 'When you were young, what did you want to be when you grew up?' },
    { 'id': 5,  'question': 'Where were you when you first heard about 9/11?' },
    { 'id': 6,  'question': 'Where did you spend New Years Eve 2000?' },
    { 'id': 7,  'question': 'Who was your childhood hero?' },
    { 'id': 8,  'question': 'What is your favorite vacation spot?' },
    { 'id': 9,  'question': 'What is the last name of your first grade teacher?' },
    { 'id': 10, 'question': 'What is your dream job?' },
    { 'id': 11, 'question': 'If you won the Lotto, what is the first thing you would do?' },
    { 'id': 12, 'question': 'What is the title of your favorite book?' }
  ];
}
