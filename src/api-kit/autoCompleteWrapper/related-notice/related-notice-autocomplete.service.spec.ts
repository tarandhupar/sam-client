import { Observable } from 'rxjs/Observable';
import { RelatedNoticeAutocompleteService } from './related-notice-autocomplete.service';

describe('api-kit/autoCompleteWrapper/related-notice/related-notice-autocomplete.service.spec.ts', () => {

  beforeEach(() => {
    this.mockOpportunityService = jasmine.createSpyObj('opportunity service', ['searchRelatedOpportunities']);
    this.mockOpportunityTypeLabelPipe = jasmine.createSpyObj('opportunity type label pipe', ['transform']);

    this.mockOpportunityTypeLabelPipe.transform.and.callFake((type) => {
      if (type === 'p') { return 'Presolicitation'; }
      if (type === 'a') { return 'Award Notice'; }
      return null;
    });

    this.service = new RelatedNoticeAutocompleteService(this.mockOpportunityService, this.mockOpportunityTypeLabelPipe);

    this.mockPresolicitation = {
      opportunityId: "111",
      solicitationNumber: "12345",
      title: "99--Janitorial Services",
      type: "p"
    };

    this.mockAwardNotice = {
      opportunityId: "222",
      solicitationNumber: "67890",
      title: "99--NEXTGEN",
      type: "a"
    };
  });

  describe('valid search', () => {

    it('should process data from api', (done) => {
      this.mockOpportunityService.searchRelatedOpportunities.and.returnValue(Observable.of({
        _embedded: {
          relatedOpportunity: [this.mockPresolicitation, this.mockAwardNotice]
        }
      }));

      let search = this.service.fetch('keyword', false, {type: 's'});

      // return data processed to join the solicitation number, title, and notice type together
      search.subscribe(results => {
        expect(results).toBeDefined();
        expect(results.sort()).toEqual([
          {
            key: this.mockPresolicitation.opportunityId,
            value: this.mockPresolicitation.solicitationNumber
            + ' - ' + this.mockPresolicitation.title
            + ' - ' + this.mockOpportunityTypeLabelPipe.transform(this.mockPresolicitation.type)
          },
          {
            key: this.mockAwardNotice.opportunityId,
            value: this.mockAwardNotice.solicitationNumber
            + ' - ' + this.mockAwardNotice.title
            + ' - ' + this.mockOpportunityTypeLabelPipe.transform(this.mockAwardNotice.type)
          }
        ].sort());
        done();
      });
    });

    it('should handle zero results', (done) => {
      this.mockOpportunityService.searchRelatedOpportunities.and.returnValue(Observable.of({}));
      let search = this.service.fetch('keyword', false, {type: 's'});

      search.subscribe(_ => {
        fail('received a result');
      }, _ => {
        fail('received an error')
      }, () => {
        done();
      });
    });
  });

  describe('malformed search', () => {

    // todo: track async call completion better
    it('should return a default response', () => {
      let finished = 0;

      // case: missing keyword
      let search = this.service.fetch(null, false, {type: 's'});
      search.subscribe(results => {
        finished++;
        expect(results).toBe(RelatedNoticeAutocompleteService.defaultResponse);
      });

      search = this.service.fetch(void 0, false, {type: 's'});
      search.subscribe(results => {
        finished++;
        expect(results).toBe(RelatedNoticeAutocompleteService.defaultResponse);
      });

      // case: missing notice type
      search = this.service.fetch('keyword', false, null);
      search.subscribe(results => {
        finished++;
        expect(results).toBe(RelatedNoticeAutocompleteService.defaultResponse);
      });

      search = this.service.fetch('keyword', false, void 0);
      search.subscribe(results => {
        finished++;
        expect(results).toBe(RelatedNoticeAutocompleteService.defaultResponse);
      });

      search = this.service.fetch('keyword', false, {otherProperty: 's'});
      search.subscribe(results => {
        finished++;
        expect(results).toBe(RelatedNoticeAutocompleteService.defaultResponse);
      });

      expect(finished).toEqual(5); // make sure all async expects executed
    });
  });
});
