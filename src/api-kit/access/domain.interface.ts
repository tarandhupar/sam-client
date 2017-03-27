export interface IDomain {
  "_embedded": {
    "domainList": [
      {
        "_links"?: {
          "self"?: {
            "href"?: "https://csp-api.sam.gov:443/rms/v1/domains/1"
          }
        },
        "id": number,
        "domainName": string
      }
    ]
  }
}
