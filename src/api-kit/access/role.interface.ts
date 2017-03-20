import { IdVal } from "./access.interface";

export interface IRole {
  "role": IdVal,
  "functionContent"?: {
    "function"?: IdVal
    "permission"?: IdVal[]
  }[],
}
