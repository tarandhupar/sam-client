export interface IPermissions {
  "_embedded": {
    "permissionList": [
      {
        "id": 1,
        "permissionName": string,
        "isActive": boolean,
        "isLegacy": boolean,
        "_links": {
          "self": {
            "href": string
          }
        },
      }
    ]
  }
}
