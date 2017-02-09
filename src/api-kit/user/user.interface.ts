export interface UserAccess {
  "userAccessId"?: number,
  "user"?: string, //"00.T.BRENDAN.MCDONOUGH@GSA.GOV",
  "createdBy"?: string, //"FTS-ADMIN",
  "createdDate"?: string, //"01/23/2008",
  "updatedBy"?: string, //"00.T.BRENDAN.MCDONOUGH@GSA.GOV",
  "updatedDate"?: string, //"08/25/2015",
  "roleMapContent"?: UserRole[],
  "_links"?: {
    "self"?: {
      "href"?: string
    }
  }
}

export interface UserRole {
  "role"?: number, //1,
  "roleData"?: UserDomainOrg[]
}

export interface UserDomainOrg {
  "organizationContent"?: UserOrganization
  "domain"?: number,
  "email"?: string,
}

export interface UserOrganization {
  "orgKey"?: string,
  "FunctionContent"?: UserFunction[]
}

export interface UserFunction {
  "function"?: number,
  "permission"?: number[]
}
