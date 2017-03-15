import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SidenavService } from "sam-ui-kit/components/sidenav/services/sidenav.service";
import {Router, NavigationEnd} from '@angular/router';

@Component({
  selector: 'object-sidebar',
  templateUrl: 'object-sidebar.template.html',
  providers: [  ]
})

export class ObjectSidebarComponent implements OnInit{
  // On load select first item on sidenav component
  selectedPage: number = 0;
  pageFragment: string;
  @Input() sidenavModel;
  @Output() public sideNavClick = new EventEmitter();

  constructor(private sidenavService: SidenavService, private router: Router){

    router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        const tree = router.parseUrl(router.url);
        this.pageFragment = tree.fragment;
        if (this.pageFragment) {
          const element = document.getElementById(tree.fragment);
          if (element) { element.scrollIntoView(); }
        }
      }
    });
  }

  ngOnInit(){
    this.sidenavService.updateData(this.selectedPage, 0);
  }

  selectedItem(item){
    this.selectedPage = this.sidenavService.getData()[0];
    this.sideNavClick.emit({
      selectedPage: this.selectedPage
    });
  }

  sidenavPathEvtHandler(data){

    data = data.indexOf('#') > 0 ? data.substring(data.indexOf('#')) : data;
    if (this.pageFragment == data.substring(1)) {
      document.getElementById(this.pageFragment).scrollIntoView();
    }
    else if(data.charAt(0)=="#"){
            this.router.navigate([], { fragment: data.substring(1) });
    } else {
      this.router.navigate([data]);
    }
  }
}

