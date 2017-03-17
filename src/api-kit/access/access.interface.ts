export interface IdVal {
  id: string|number,
  val: string|number
}

export interface UserAccessInterface {
  user?: number|string,
  "domainMapContent"?: Array<
    {
      "domain": any,
      "roleMapContent": Array<
        {
          "role": any,
          "organizationMapContent": Array<
            {
              "organizations": Array<number|string>,
              "functionMapContent":Array<
                {
                  "function": any,
                  "permission":Array<any>
                }
              >
            }
          >
        }
      >
    }
  >,
  "id"?: string
}

export interface UserAccessPostInterface {
  user?: number|string,
  "domainContent"?: Array<
    {
      "domain": IdVal|number|string,
      "roleContent": Array<
        {
          "role":IdVal|number|string,
          "organizationContent": Array<
            {
              "organizations": Array<number|string>,
              "functionContent"?:Array<
                {
                  "function":IdVal|number|string,
                  "permission":Array<IdVal|number|string>
                }
                >
            }
            >
        }
        >
    }
    >,
  "id"?: string
}

export interface UserAccessWrapper {
  "updatedAccessContent"?: UserAccessPostInterface
  "existingAccessContent"?: UserAccessPostInterface
  "message"?:string,
  "mode":"grant"|"request"|"edit"|"remove"
}
