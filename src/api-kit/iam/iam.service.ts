import { Injectable } from '@angular/core';
import { ApiService } from './api';

@Injectable()
export class IAMService {
  public iam;

  constructor() {
    this.iam = new ApiService().iam;
  }
}
