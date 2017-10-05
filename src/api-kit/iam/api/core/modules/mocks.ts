import { merge } from 'lodash';
import { User } from '../user';

export function getMockUser() {
  const answer = '        ';

  return merge(User.getCache(), {
    _id: 'doe.john@gsa.gov',
    email: 'doe.john@gsa.gov',

    middleName: 'J',
    firstName: 'John',
    initials: 'J',
    lastName: 'Doe',
    suffix: 'Jr.',

    personalPhone: '12401234568',
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

      'system-accounts.management': {
        href: '/comp/iam/cws/api/system-accounts',
      },

      'system-accounts.migration': {
        href: '/comp/iam/import/system-accounts',
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

export function getMockSystemAccount(index) {
  const types = ['Gov','Non-Gov'];

  index = index || 1;

  return {
    _id:               `system-email-${index}@email.com`,
    email:             `system-email-${index}@email.com`,
    systemType:        types[Math.random()],
    systemName:        `System-Account-${index}`,
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
