export interface POC {
  email: string,
  firstName: string,
  lastName: string,
  phone?: string
}

export interface System {
  _id: string,
  email: string,
  systemName: string,
  systemType: string,          // values => Gov|Non-Gov
  comments: string,
  department?: string|number,
  duns?: string|number,
  businessName?: string,
  businessAddress?: string,
  ipAddress?: string,
  primaryOwnerName?: string,
  primaryOwnerEmail?: string,
  pointOfContact: POC[]
}
