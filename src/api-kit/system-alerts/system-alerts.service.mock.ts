import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class SystemAlertsServiceMock {
  getAll() {
    return Observable.of({"total":71,"alerts":[{"id":83,"rank":null,"createdDate":null,"createdBy":null,"lastModifiedBy":null,"lastModifiedDate":"2017-01-23T10:02:32.840-0500","status":"Draft","content":{"title":"My favorite alert","description":"This alert was edited by app content team","severity":"Warning","begins":null,"expires":"2025-01-10T16:22:00.000-0500","published":"2017-09-06T05:04:00.000-0400","isExpiresIndefinite":"N"}},{"id":38,"rank":null,"createdDate":"2017-01-10T22:47:37.401-0500","createdBy":"Admin","lastModifiedBy":"Admin","lastModifiedDate":"2017-01-10T22:47:37.401-0500","status":"Draft","content":{"title":"1","description":"23","severity":"Error","begins":"2017-01-10T22:47:37.401-0500","expires":null,"published":"2018-01-01T01:01:00.000-0500","isExpiresIndefinite":"N"}},{"id":40,"rank":null,"createdDate":null,"createdBy":null,"lastModifiedBy":null,"lastModifiedDate":"2017-01-11T16:55:37.056-0500","status":"Draft","content":{"title":"11","description":"abcxyz","severity":"Error","begins":null,"expires":null,"published":"2018-01-11T01:26:00.000-0500","isExpiresIndefinite":"Y"}},{"id":66,"rank":null,"createdDate":"2017-01-17T11:13:49.624-0500","createdBy":"Admin","lastModifiedBy":"Admin","lastModifiedDate":"2017-01-17T11:13:49.624-0500","status":"Draft","content":{"title":"Regular alert","description":"Create This alert","severity":"Error","begins":"2017-01-17T11:13:49.624-0500","expires":"2033-09-16T03:07:00.000-0400","published":"2018-02-15T23:45:00.000-0500","isExpiresIndefinite":"N"}},{"id":89,"rank":null,"createdDate":null,"createdBy":null,"lastModifiedBy":null,"lastModifiedDate":"2017-01-23T10:09:36.881-0500","status":"Draft","content":{"title":"My favorite alert","description":"This alert was edited by app content team","severity":"Error","begins":null,"expires":"2019-11-16T11:30:00.000-0500","published":"2018-05-20T20:10:00.000-0400","isExpiresIndefinite":"N"}}]});
  }

}
