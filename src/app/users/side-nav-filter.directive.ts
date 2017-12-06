import { ChangeDetectorRef, Directive, ElementRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { ProfilePageService } from './profile-page.service';

@Directive({
  selector: 'side-nav-filter'
})
export class SideNavFilterSelector {
  constructor(private cdr: ChangeDetectorRef, private viewRef: ViewContainerRef, private helpers: ProfilePageService) {}

  ngOnInit() {
    this.helpers.filter$.subscribe(template => {
      this.viewRef.clear();

      if(template instanceof TemplateRef) {
        this.viewRef.createEmbeddedView(template as TemplateRef<SideNavFilterDirective>);
      }

      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this.helpers.filter$.unsubscribe();
  }
};

@Directive({
  selector: '[sideNavFilter]'
})
export class SideNavFilterDirective {
  constructor(private templateRef: TemplateRef<any>, private helpers: ProfilePageService) {}

  ngAfterViewInit() {
    this.helpers.filter$.next(this.templateRef);
  }

  ngOnDestroy() {
    this.helpers.filter$.next(null);
  }
}
