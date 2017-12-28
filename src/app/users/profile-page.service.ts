import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ProfilePageService {
  public filter$ = new Subject();
}
