import { RelatedNoticeComponent } from './related-notice.component';
import { Observable } from 'rxjs/Observable';

describe('Opportunity - Related Notice Component', () => {

  beforeEach(() => {
    this.mockOpportunityService = jasmine.createSpyObj('opportunity service', ['getOpportunity']);
    this.mockOpportunityTypeLabelPipe = jasmine.createSpyObj('opportunity type label pipe', ['transform']);

    this.mockOpportunityTypeLabelPipe.transform.and.callFake((type) => {
      if (type === 'p') { return 'Presolicitation'; }
      if (type === 'a') { return 'Award Notice'; }
      return null;
    });

    this.comp = new RelatedNoticeComponent(this.mockOpportunityService, this.mockOpportunityTypeLabelPipe);
    this.comp.ngOnInit();
  });

  it('should compile', () => {
    expect(this.comp).toBeDefined();
    expect(this.comp.relatedNoticeForm).toBeDefined();
    expect(this.comp.relatedNoticeControl).toBeDefined();
  });

  it('should propagate autocompleted data', (done) => {
    let testNotice = {key: '123', value: 'test notice title'};
    this.comp.registerOnChange((value) => {
      expect(value).toEqual(testNotice.key);
      done();
    });

    this.comp.relatedNoticeControl.setValue(testNotice);
  });

  it('should write valid notice id', () => {
    let testId = '123';
    let mockOpportunity = {
      data: {
        solicitationNumber: '99',
        title: 'title',
        type: 'a'
      }
    };

    this.mockOpportunityService.getOpportunity.and.returnValue(Observable.of(mockOpportunity));
    this.comp.writeValue(testId);

    let value = mockOpportunity.data.solicitationNumber
      + ' - ' + mockOpportunity.data.title
      + ' - ' + this.mockOpportunityTypeLabelPipe.transform(mockOpportunity.data.type);
    expect(this.comp.relatedNoticeControl.value).toEqual({key: testId, value: value});
  });

});
