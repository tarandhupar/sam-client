export interface IdVal {
  id: string|number,
  val: string|number
}

export interface UserAccessInterface {
  user?: number|string,
  messages?: string,
  "domainMapContent"?: Array<
    {
      "domain": IdVal,
      "roleMapContent": Array<
        {
          "role":IdVal,
          "organizationMapContent": Array<
            {
              "organizations": Array<number|string>,
              "functionMapContent":Array<
                {
                  "function":IdVal,
                  "permission":Array<IdVal>
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
