import { KBA } from './kba.interface';

export interface User {
  _id: string,
  email: string,

  title?: string,
  suffix?: string,

  fullName?: string,
  middleName?: string,

  firstName: string,
  initials: string,
  lastName: string,

  homePhone?: string,
  workPhone?: string,
  mobile?: string,
  phoneExtension?: string,

  businessName?: string,

  address1Street?: string,
  address1City?: string,
  address1Country?: string,
  address1State?: string,
  address1Type?: string,
  address1Zip?: string,

  address2Street?: string,
  address2City?: string,
  address2Country?: string,
  address2State?: string,
  address2Type?: string,
  address2Zip?: string,

  // Hierarchy
  departmentID?: number | string,
  agencyID?: number | string,
  officeID?: number | string,

  kbaAnswerList?: KBA[],

  userPassword?: string,
  accountClaimed?: boolean,
  systemAccount?: boolean,
  emailNotification?: boolean | string
}
