import { POC } from './poc';

export interface System {
  _id: string,
  email: string,
  systemType: string,          // Gov|Non-Gov
  systemName: string,
  systemVersion?: string,
  systemDescription?: string;
  comments?: string,          // *
  department?: string|number,
  duns?: string|number,       // *
  businessName?: string,      // *
  businessAddress?: string,   // *
  ipAddress?: string,
  primaryOwnerName?: string,  // *
  primaryOwnerEmail?: string, // *
  pointOfContact?: (string|number)[],
  securityOfficerName?: string,
  securityOfficerEmail?: string,
  permissions?: string[],     // co-read|co-read-sensitive|co-write|cd-read|cd-write|cd-dod-data|ei-read-public|ei-read-fouo|ei-read-sensitive
  fjps?: string,              // Low|Medium|High
  connection?: string,        // Web Services, SFTP
  location?: string,
  ato?: string,               // PDF Upload
  certified?: boolean,
}
