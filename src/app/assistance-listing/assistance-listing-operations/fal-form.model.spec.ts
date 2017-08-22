import {TestBed, ComponentFixture} from '@angular/core/testing';
import {ProgramService} from './program.service';
import {WrapperService} from '../wrapper/wrapper.service'
import {FALFormViewModel} from "./fal-form.model";
import any = jasmine.any;


describe('src/app/assistance-listing/assistance-listing-operations/fal-form.model.spec.ts', () => {
  let service: FALFormViewModel;
  beforeEach(() => {
  });
  /*header-information Section*/
  it('header-information GetStatus: pristine', () => {
    let _fal = {
      "additionalInfo": {
        "sections": [
          {
            "id": "header-information",
            "status": "pristine"
          }
        ]
      },
    };
    service = new FALFormViewModel(_fal);
    expect(service.getSectionStatus('header-information')).toEqual('pristine');
  });
  it('header-information GetStatus: updated', () => {
    let _fal = {
      "additionalInfo": {
        "sections": [
          {
            "id": "header-information",
            "status": "updated"
          }
        ]
      },
    };
    service = new FALFormViewModel(_fal);
    expect(service.getSectionStatus('header-information')).toEqual('updated');
  });

  it('header-information SetStatus: pristine', () => {
    let _fal = {
      "additionalInfo": {
        "sections": []
      },
    };
    service = new FALFormViewModel(_fal);
    service.setSectionStatus('header-information', 'pristine');
    service.existing = null;
    expect(service.existing).toBeNull();
    expect(service.addiInfo.sections).toBeDefined();
    expect(service.addiInfo.sections.length).toEqual(1);
    expect(service.addiInfo.sections[0].id).toEqual('header-information');
    expect(service.addiInfo.sections[0].status).toEqual('pristine');
  });

  it('header-information SetStatus: updated', () => {
    let _fal = {
      "additionalInfo": {
        "sections": [
          {
            "id": "header-information",
            "status": "updated"
          }
        ]
      },
    };
    service = new FALFormViewModel(_fal);
    service.setSectionStatus('header-information', 'updated');
    expect(service.addiInfo.sections[0].status).toEqual(service.existing.status);
  });

  /*Overview Section*/
  it('overview GetStatus : pristine', () => {
    let _fal = {
      "additionalInfo": {
        "sections": [
          {
            "id": "overview",
            "status": "pristine"
          }
        ]
      },
    };
    service = new FALFormViewModel(_fal);
    expect(service.getSectionStatus('overview')).toEqual('pristine');
  });
  it('overview GetStatus: updated', () => {
    let _fal = {
      "additionalInfo": {
        "sections": [
          {
            "id": "overview",
            "status": "updated"
          }
        ]
      },
    };
    service = new FALFormViewModel(_fal);
    expect(service.getSectionStatus('overview')).toEqual('updated');
  });

  it('overview SetStatus: pristine', () => {
    let _fal = {
      "additionalInfo": {
        "sections": []
      },
    };
    service = new FALFormViewModel(_fal);
    service.setSectionStatus('overview', 'pristine');
    service.existing = null;
    expect(service.existing).toBeNull();
    expect(service.addiInfo.sections).toBeDefined();
    expect(service.addiInfo.sections.length).toEqual(1);
    expect(service.addiInfo.sections[0].id).toEqual('overview');
    expect(service.addiInfo.sections[0].status).toEqual('pristine');
  });

  it('overview SetStatus: updated', () => {
    let _fal = {
      "additionalInfo": {
        "sections": [
          {
            "id": "overview",
            "status": "updated"
          }
        ]
      },
    };
    service = new FALFormViewModel(_fal);
    service.setSectionStatus('overview', 'updated');
    expect(service.addiInfo.sections[0].status).toEqual(service.existing.status);
  });

  /*Authorization  Section*/
  it('Authorization GetStatus : pristine', () => {
    let _fal = {
      "additionalInfo": {
        "sections": [
          {
            "id": "authorization",
            "status": "pristine"
          }
        ]
      },
    };
    service = new FALFormViewModel(_fal);
    expect(service.getSectionStatus('authorization')).toEqual('pristine');
  });
  it('authorization GetStatus: updated', () => {
    let _fal = {
      "additionalInfo": {
        "sections": [
          {
            "id": "authorization",
            "status": "updated"
          }
        ]
      },
    };
    service = new FALFormViewModel(_fal);
    expect(service.getSectionStatus('authorization')).toEqual('updated');
  });

  it('authorization SetStatus: pristine', () => {
    let _fal = {
      "additionalInfo": {
        "sections": []
      },
    };
    service = new FALFormViewModel(_fal);
    service.setSectionStatus('authorization', 'pristine');
    service.existing = null;
    expect(service.existing).toBeNull();
    expect(service.addiInfo.sections).toBeDefined();
    expect(service.addiInfo.sections.length).toEqual(1);
    expect(service.addiInfo.sections[0].id).toEqual('authorization');
    expect(service.addiInfo.sections[0].status).toEqual('pristine');
  });

  it('authorization SetStatus: updated', () => {
    let _fal = {
      "additionalInfo": {
        "sections": [
          {
            "id": "authorization",
            "status": "updated"
          }
        ]
      },
    };
    service = new FALFormViewModel(_fal);
    service.setSectionStatus('authorization', 'updated');
    expect(service.addiInfo.sections[0].status).toEqual(service.existing.status);
  });


  /*financial-information-obligations  Section*/
  it('financial-information-obligations GetStatus : pristine', () => {
    let _fal = {
      "additionalInfo": {
        "sections": [
          {
            "id": "financial-information-obligations",
            "status": "pristine"
          }
        ]
      },
    };
    service = new FALFormViewModel(_fal);
    expect(service.getSectionStatus('financial-information-obligations')).toEqual('pristine');
  });
  it('financial-information-obligations GetStatus: updated', () => {
    let _fal = {
      "additionalInfo": {
        "sections": [
          {
            "id": "financial-information-obligations",
            "status": "updated"
          }
        ]
      },
    };
    service = new FALFormViewModel(_fal);
    expect(service.getSectionStatus('financial-information-obligations')).toEqual('updated');
  });

  it('financial-information-obligations SetStatus: pristine', () => {
    let _fal = {
      "additionalInfo": {
        "sections": []
      },
    };
    service = new FALFormViewModel(_fal);
    service.setSectionStatus('financial-information-obligations', 'pristine');
    service.existing = null;
    expect(service.existing).toBeNull();
    expect(service.addiInfo.sections).toBeDefined();
    expect(service.addiInfo.sections.length).toEqual(1);
    expect(service.addiInfo.sections[0].id).toEqual('financial-information-obligations');
    expect(service.addiInfo.sections[0].status).toEqual('pristine');
  });

  it('financial-information-obligations SetStatus: updated', () => {
    let _fal = {
      "additionalInfo": {
        "sections": [
          {
            "id": "financial-information-obligations",
            "status": "updated"
          }
        ]
      },
    };
    service = new FALFormViewModel(_fal);
    service.setSectionStatus('financial-information-obligations', 'updated');
    expect(service.addiInfo.sections[0].status).toEqual(service.existing.status);
  });


  /*financial-information-other  Section*/
  it('financial-information-other GetStatus : pristine', () => {
    let _fal = {
      "additionalInfo": {
        "sections": [
          {
            "id": "financial-information-other",
            "status": "pristine"
          }
        ]
      },
    };
    service = new FALFormViewModel(_fal);
    expect(service.getSectionStatus('financial-information-other')).toEqual('pristine');
  });
  it('financial-information-other GetStatus: updated', () => {
    let _fal = {
      "additionalInfo": {
        "sections": [
          {
            "id": "financial-information-other",
            "status": "updated"
          }
        ]
      },
    };
    service = new FALFormViewModel(_fal);
    expect(service.getSectionStatus('financial-information-other')).toEqual('updated');
  });

  it('financial-information-other SetStatus: pristine', () => {
    let _fal = {
      "additionalInfo": {
        "sections": []
      },
    };
    service = new FALFormViewModel(_fal);
    service.setSectionStatus('financial-information-other', 'pristine');
    service.existing = null;
    expect(service.existing).toBeNull();
    expect(service.addiInfo.sections).toBeDefined();
    expect(service.addiInfo.sections.length).toEqual(1);
    expect(service.addiInfo.sections[0].id).toEqual('financial-information-other');
    expect(service.addiInfo.sections[0].status).toEqual('pristine');
  });

  it('financial-information-other SetStatus: updated', () => {
    let _fal = {
      "additionalInfo": {
        "sections": [
          {
            "id": "financial-information-other",
            "status": "updated"
          }
        ]
      },
    };
    service = new FALFormViewModel(_fal);
    service.setSectionStatus('financial-information-other', 'updated');
    expect(service.addiInfo.sections[0].status).toEqual(service.existing.status);
  });

  /*criteria-information  Section*/
  it('criteria-information GetStatus : pristine', () => {
    let _fal = {
      "additionalInfo": {
        "sections": [
          {
            "id": "criteria-information",
            "status": "pristine"
          }
        ]
      },
    };
    service = new FALFormViewModel(_fal);
    expect(service.getSectionStatus('criteria-information')).toEqual('pristine');
  });
  it('criteria-information GetStatus: updated', () => {
    let _fal = {
      "additionalInfo": {
        "sections": [
          {
            "id": "criteria-information",
            "status": "updated"
          }
        ]
      },
    };
    service = new FALFormViewModel(_fal);
    expect(service.getSectionStatus('criteria-information')).toEqual('updated');
  });

  it('criteria-information SetStatus: pristine', () => {
    let _fal = {
      "additionalInfo": {
        "sections": []
      },
    };
    service = new FALFormViewModel(_fal);
    service.setSectionStatus('criteria-information', 'pristine');
    service.existing = null;
    expect(service.existing).toBeNull();
    expect(service.addiInfo.sections).toBeDefined();
    expect(service.addiInfo.sections.length).toEqual(1);
    expect(service.addiInfo.sections[0].id).toEqual('criteria-information');
    expect(service.addiInfo.sections[0].status).toEqual('pristine');
  });

  it('criteria-information SetStatus: updated', () => {
    let _fal = {
      "additionalInfo": {
        "sections": [
          {
            "id": "criteria-information",
            "status": "updated"
          }
        ]
      },
    };
    service = new FALFormViewModel(_fal);
    service.setSectionStatus('criteria-information', 'updated');
    expect(service.addiInfo.sections[0].status).toEqual(service.existing.status);
  });


  /*applying-for-assistance  Section*/
  it('applying-for-assistance GetStatus : pristine', () => {
    let _fal = {
      "additionalInfo": {
        "sections": [
          {
            "id": "applying-for-assistance",
            "status": "pristine"
          }
        ]
      },
    };
    service = new FALFormViewModel(_fal);
    expect(service.getSectionStatus('applying-for-assistance')).toEqual('pristine');
  });
  it('applying-for-assistance GetStatus: updated', () => {
    let _fal = {
      "additionalInfo": {
        "sections": [
          {
            "id": "applying-for-assistance",
            "status": "updated"
          }
        ]
      },
    };
    service = new FALFormViewModel(_fal);
    expect(service.getSectionStatus('applying-for-assistance')).toEqual('updated');
  });

  it('applying-for-assistance SetStatus: pristine', () => {
    let _fal = {
      "additionalInfo": {
        "sections": []
      },
    };
    service = new FALFormViewModel(_fal);
    service.setSectionStatus('applying-for-assistance', 'pristine');
    service.existing = null;
    expect(service.existing).toBeNull();
    expect(service.addiInfo.sections).toBeDefined();
    expect(service.addiInfo.sections.length).toEqual(1);
    expect(service.addiInfo.sections[0].id).toEqual('applying-for-assistance');
    expect(service.addiInfo.sections[0].status).toEqual('pristine');
  });

  it('applying-for-assistance SetStatus: updated', () => {
    let _fal = {
      "additionalInfo": {
        "sections": [
          {
            "id": "applying-for-assistance",
            "status": "updated"
          }
        ]
      },
    };
    service = new FALFormViewModel(_fal);
    service.setSectionStatus('applying-for-assistance', 'updated');
    expect(service.addiInfo.sections[0].status).toEqual(service.existing.status);
  });


  /*compliance-requirements  Section*/
  it('compliance-requirements GetStatus : pristine', () => {
    let _fal = {
      "additionalInfo": {
        "sections": [
          {
            "id": "compliance-requirements",
            "status": "pristine"
          }
        ]
      },
    };
    service = new FALFormViewModel(_fal);
    expect(service.getSectionStatus('compliance-requirements')).toEqual('pristine');
  });
  it('compliance-requirements GetStatus: updated', () => {
    let _fal = {
      "additionalInfo": {
        "sections": [
          {
            "id": "compliance-requirements",
            "status": "updated"
          }
        ]
      },
    };
    service = new FALFormViewModel(_fal);
    expect(service.getSectionStatus('compliance-requirements')).toEqual('updated');
  });

  it('compliance-requirements SetStatus: pristine', () => {
    let _fal = {
      "additionalInfo": {
        "sections": []
      },
    };
    service = new FALFormViewModel(_fal);
    service.setSectionStatus('compliance-requirements', 'pristine');
    service.existing = null;
    expect(service.existing).toBeNull();
    expect(service.addiInfo.sections).toBeDefined();
    expect(service.addiInfo.sections.length).toEqual(1);
    expect(service.addiInfo.sections[0].id).toEqual('compliance-requirements');
    expect(service.addiInfo.sections[0].status).toEqual('pristine');
  });

  it('compliance-requirements SetStatus: updated', () => {
    let _fal = {
      "additionalInfo": {
        "sections": [
          {
            "id": "compliance-requirements",
            "status": "updated"
          }
        ]
      },
    };
    service = new FALFormViewModel(_fal);
    service.setSectionStatus('compliance-requirements', 'updated');
    expect(service.addiInfo.sections[0].status).toEqual(service.existing.status);
  });

  /*contact-information  Section*/
  it('contact-information GetStatus : pristine', () => {
    let _fal = {
      "additionalInfo": {
        "sections": [
          {
            "id": "contact-information",
            "status": "pristine"
          }
        ]
      },
    };
    service = new FALFormViewModel(_fal);
    expect(service.getSectionStatus('contact-information')).toEqual('pristine');
  });
  it('contact-information GetStatus: updated', () => {
    let _fal = {
      "additionalInfo": {
        "sections": [
          {
            "id": "contact-information",
            "status": "updated"
          }
        ]
      },
    };
    service = new FALFormViewModel(_fal);
    expect(service.getSectionStatus('contact-information')).toEqual('updated');
  });

  it('contact-information SetStatus: pristine', () => {
    let _fal = {
      "additionalInfo": {
        "sections": []
      },
    };
    service = new FALFormViewModel(_fal);
    service.setSectionStatus('contact-information', 'pristine');
    service.existing = null;
    expect(service.existing).toBeNull();
    expect(service.addiInfo.sections).toBeDefined();
    expect(service.addiInfo.sections.length).toEqual(1);
    expect(service.addiInfo.sections[0].id).toEqual('contact-information');
    expect(service.addiInfo.sections[0].status).toEqual('pristine');
  });

  it('contact-information SetStatus: updated', () => {
    let _fal = {
      "additionalInfo": {
        "sections": [
          {
            "id": "contact-information",
            "status": "updated"
          }
        ]
      },
    };
    service = new FALFormViewModel(_fal);
    service.setSectionStatus('contact-information', 'updated');
    expect(service.addiInfo.sections[0].status).toEqual(service.existing.status);
  });

});

