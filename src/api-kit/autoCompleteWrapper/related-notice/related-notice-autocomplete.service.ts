import { Directive, Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { AutocompleteService } from 'sam-ui-elements/src/ui-kit/form-controls/autocomplete/autocomplete.service';
import { OpportunityFormService } from '../../../app/opportunity/opportunity-operations/framework/service/opportunity-form/opportunity-form.service';
import { OpportunityTypeLabelPipe } from '../../../app/opportunity/pipes/opportunity-type-label.pipe';

// todo: see if these can be used as a more general type?
type RelatedNoticeSearchResult = {
  opportunityId: string,
  title: string,
  solicitationNumber: string,
  type: string,
};

type AutocompleteOption = {
  key: string,
  value: string,
}

@Injectable()
export class RelatedNoticeAutocompleteService implements AutocompleteService {
  public static readonly defaultResponse = []; // returned in case of malformed query

  constructor(private oOpportunityFormService: OpportunityFormService,
              private noticeTypePipe: OpportunityTypeLabelPipe) {
  }

  public fetch(val: string, pageEnd: boolean, serviceOptions: {type: string}): Observable<AutocompleteOption[]> {
    if (!val) {
      console.error('No keyword was provided when searching for related notices.');
    }

    if (!(serviceOptions && serviceOptions.type)) {
      console.error('No notice type was provided when searching for related notices.');
    }

    if (val && serviceOptions && serviceOptions.type) {
      return this.getData(val, serviceOptions.type);
    }

    return Observable.of(RelatedNoticeAutocompleteService.defaultResponse);
  }

  private getData(q: string, type: string): Observable<AutocompleteOption[]> {
    const size = 100;

    return this.oOpportunityFormService.searchRelatedOpportunities(q, type, size)
      .filter(res => (res && res._embedded && res._embedded.relatedOpportunity))
      .map(res => this.processSearchResults(res._embedded.relatedOpportunity));
  }

  private processSearchResults(results: RelatedNoticeSearchResult[]): AutocompleteOption[] {
    return results.map((relatedNotice) => {
      let key = relatedNotice.opportunityId;

      let noticeType = this.noticeTypePipe.transform(relatedNotice.type);
      let value = [relatedNotice.solicitationNumber, relatedNotice.title, noticeType].join(' - ');

      return { key, value };
    });
  }

  public setFetchMethod(_?: any): void {
  }

}

@Directive({
  selector: 'sam-autocomplete[autofill-oppRelatedNotice],sam-autocomplete-multiselect[autofill-oppRelatedNotice]',
  providers: [
    {provide: AutocompleteService, useExisting: RelatedNoticeAutocompleteService}
  ]
})
export class RelatedNoticeServiceDirective {
}
