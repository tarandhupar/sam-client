export interface IdVal {
  id: string|number,
  val: string|number
}

export interface UserAccessInterface2 {
  user?: number|string,
  messages?: string,
  "domainMapContent":[
    {
      "domain": IdVal,
      "roleMapContent":[
        {
          "role":IdVal,
          "organizationMapContent":[
            {
              "organizations":[
                "111",
                "222"
                ],
              "functionMapContent":[
                {
                  "function":IdVal,
                  "permission":[
                    {
                      "id":3,
                      "val":null
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "id":"sumitdang"
}
