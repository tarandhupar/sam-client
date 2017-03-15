export interface IdVal {
  id: string|number,
  val: string|number
}

// export interface UserAccessInterface {
//   "messages"?: string,
//   "userAccessId"?: number,
//   "user"?: string,
//   "createdBy"?: string,
//   "createdDate"?: string,
//   "updatedBy"?: string,
//   "updatedDate"?: string,
//   "roleMapContent"?: Array<{
//     "role"?: IdVal, //1,
//     "roleData"?: Array<{
//       "organizationMapContent"?: {
//         "orgKey"?: string,
//         "functionMapContent"?: Array<{
//           "function"?: IdVal,
//           "permission"?: Array<IdVal>
//         }>
//       }
//       organizationIds?: Array<string>,
//       "functionMapContent"?: Array<{
//         "function"?: IdVal,
//         "permission"?: Array<IdVal>
//       }>
//       "domain"?: IdVal,
//       "email"?: string,
//     }>,
//   }>,
//   "_links"?: {
//     "self"?: {
//       "href"?: string
//     }
//   }
// }

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
