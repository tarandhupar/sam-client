export interface IdVal {
  id: string|number,
  val: string|number
}

export interface UserAccessInterface {
  "messages"?: string,
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
      organizationIds?: Array<string>,
      "functionMapContent"?: Array<{
        "function"?: IdVal,
        "permission"?: Array<IdVal>
      }>
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

export interface UserAccessInterface2 {
  "domainMapContent":[
    {
      "domain":{
        "id":1,
        "val":"AWARD"
      },
      "roleMapContent":[
        {
          "role":{
            "id":1,
            "val":null
          },
          "organizationMapContent":[
            {
              "organizations":[
                "111",
                "222"
                ],
              "functionMapContent":[
                {
                  "function":{
                    "id":1,
                    "val":null
                  },
                  "permission":[
                    {
                      "id":3,
                      "val":null
                    },
                    {
                      "id":4,
                      "val":null
                    }
                    ]
                },
                {
                  "function":{
                    "id":2,
                    "val":null
                  },
                  "permission":[
                    {
                      "id":1,
                      "val":null
                    },
                    {
                      "id":2,
                      "val":null
                    }
                    ]
                }
                ]
            },
            {
              "organizations":[
                "333",
                "444"
                ],
              "functionMapContent":[
                {
                  "function":{
                    "id":1,
                    "val":null
                  },
                  "permission":[
                    {
                      "id":11,
                      "val":null
                    },
                    {
                      "id":12,
                      "val":null
                    }
                    ]
                },
                {
                  "function":{
                    "id":2,
                    "val":null
                  },
                  "permission":[
                    {
                      "id":21,
                      "val":null
                    },
                    {
                      "id":22,
                      "val":null
                    },
                    {
                      "id":23,
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
