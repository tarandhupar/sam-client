export interface IDomain {
  "_embedded": {
    "domainList": [
      {
        "_links"?: {
          "self"?: {
            "href"?: "https://csp-api.sam.gov:443/rms/v1/domains/1"
          }
        },
        "pk_domain": 1,
        "domainName": string, //"AWARD",
        "legacyDomains"?: string, //"FPDS,",
        "is_active"?: boolean, true,
        "created_by"?: "RMS",
        "created_date"?: "03/09/2017",
        "updated_by"?: "RMS",
        "updated_date"?: "03/09/2017"
      }
    ]
  }
}
