import * as _ from 'lodash';

export class SidenavHelper {

  updateSideNav(displayComponent, isOpportunity, content?) {

    let self = displayComponent;
    //refresh side nav to fix the bug on clicking the parent tab `Wage Determination` will take you to the previous version
    if (!isOpportunity){
      displayComponent.sidenavModel.children = [];
    }
    if (content) {
      // Items in first level (pages) have to have a unique name
      let repeatedItem = _.findIndex(displayComponent.sidenavModel.children, item => item.label == content.label);
      // If page has a unique name added to the sidenav
      if (repeatedItem === -1) {
        displayComponent.sidenavModel.children.push(content);
      }
    }

    updateContent();

    function updateContent() {
      let children = _.map(self.sidenavModel.children, function(possiblePage) {
        let possiblePagechildren = _.map(possiblePage.children, function(possibleSection) {
          if(isOpportunity && self.shouldBeDisplayed(possibleSection.field)){
            possibleSection.route = "#" + self.generateID(possibleSection.field);
            return possibleSection;
          } else if(!isOpportunity){
            possibleSection.route = possibleSection.field;
            return possibleSection;
          }
        });
        possiblePagechildren = _.filter(possiblePagechildren, item => {
          return !_.isUndefined(item);
        });
        possiblePage.children = possiblePagechildren;
        return possiblePage;
      });
      self.sidenavModel.children = children;
    }
  }

  sidenavPathEvtHandler(displayComponent, data){
    data = data.indexOf('#') > 0 ? data.substring(data.indexOf('#')) : data;

    if (data.charAt(0)=="#") {
      this.scrollToWithBannerOffset(data.substring(1));
    }
    else {
      displayComponent.router.navigate([data]);
    }
  }

  // When scrolling to an element, we get the visible height of the sticky banner and offset the scrolling by it
  // This prevents the banner from overlapping the anchor target
  private scrollToWithBannerOffset(targetId) {
    let bannerHeight = document.getElementsByClassName('sticky-banner')[0].clientHeight;
    let element = document.getElementById(targetId);
    element.scrollIntoView(true);
    window.scrollBy(0, -bannerHeight);

    // after scrolling, update the url fragment as well
    // we use pushState so that the browser does not try to navigate to the anchor
    history.pushState({}, '', window.location.pathname + '#' + targetId);
  }

  DOMComplete(displayComponent, observable){
    observable.subscribe(
      () => {
        if (displayComponent.pageFragment && document.getElementById(displayComponent.pageFragment)) {
          document.getElementById(displayComponent.pageFragment).scrollIntoView();
        }
      },
      () => {
        if (displayComponent.pageFragment && document.getElementById(displayComponent.pageFragment)) {
          document.getElementById(displayComponent.pageFragment).scrollIntoView();
        }
      });
  }
}
