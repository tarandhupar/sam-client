export interface IdVal {
  id: string|number,
  val: string|number
}

export interface UserAccessInterface {
  "userAccessId"?: number,
  "user"?: string,
  "createdBy"?: string,
  "createdDate"?: string,
  "updatedBy"?: string,
  "updatedDate"?: string,
  "roleMapContent"?: Array<{
    "role"?: IdVal, //1,
    "roleData"?: Array<{
      "organizationMapContent"?: {
        "orgKey"?: string,
        "functionMapContent"?: Array<{
          "function"?: IdVal,
          "permission"?: Array<IdVal>
        }>
      }
      "domain"?: IdVal,
      "email"?: string,
    }>,
  }>,
  "_links"?: {
    "self"?: {
      "href"?: string
    }
  }
}
