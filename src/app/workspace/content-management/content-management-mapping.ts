export class CMSMapping  {
  statusMapping = {
    'NEW':1,
    'PUBLISHED':2,
    'DRAFT':3,
    'ARCHIVED':4
  };

  typeMap = {
    'data-dictionary':1,
    'faq-repository':2,
    'video-library':3,
  };

  validSections = ['data-dictionary', 'FAQ-repository', 'video-library'];

  sectionMapping = {

    'data-dictionary': {
      name: 'Data Dictionary',
      publicViewTag: 'Data Definition',
    },
    'FAQ-repository': {
      name: 'FAQ Repository',
      publicViewTag: 'FAQ',
    },
    'video-library': {
      name: 'Video Library',
      publicViewTag: 'Video',
    },
  };

  constructor(){}

  getStatusId (statusName) {
    return this.statusMapping[statusName];
  }

  getStatusName (statusId) {
    let statusName = '';
    Object.keys(this.statusMapping).forEach( key => {
      if(this.statusMapping[key] == statusId) statusName = key;
    });
    return statusName;
  }

  getTypeId(typeName){
    return this.typeMap[typeName];
  }

  isSectionValid(section){
    return this.validSections.indexOf(section) !== -1;
  }

  getSectionTextName(section): string{
    if(this.isSectionValid(section)){
      return this.sectionMapping[section].name;
    }
    return '';
  }

  getSectionPublicTagName(section): string{
    if(this.isSectionValid(section)){
      return this.sectionMapping[section].publicViewTag;
    }
    return '';
  }
};
