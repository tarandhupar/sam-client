export interface CWSApplication {
  uid: string|number;
  systemAccountName: string;
  interfacingSystemName?: string;
  interfacingSystemVersion: string;
  systemDescriptionAndFunction: string;
  departmentOrgId: string;
  agencyOrgId: string;
  officeOrgId: string;
  systemAdmins: string|string[];
  systemManagers: string|string[];
  contractOpportunities: string|string[]; // read,read-sensitive,co-write
  contractData: string|string[];          // read,cd-write,dod-data
  entityInformation: string|string[];     // read-public,read-fouo,read-sensitive
  fips199Categorization: string;          // low,medium,high
  ipAddress: string;
  typeOfConnection: string;               // Web Services,SFTP
  physicalLocation: string;
  securityOfficialName: string;
  securityOfficialEmail: string;
  uploadAto: string;                      // PDF Upload
  authorizationConfirmation: boolean;
  authorizingOfficialName: string;
  authorizationDate: Date|string|number;
  lastUpdate?: Date|string|number;
  submittedBy?: string;
  submittedDate?: Date|string|number;
  securityApprover: string;
  securityApproved_Date: Date|string|number;
  dateOfRejection: Date|string|number;
  rejectedBy: string;
  rejectionReason: string;
  applicationStatus?: string;
  statuses?: string|(string|number)[];
};
