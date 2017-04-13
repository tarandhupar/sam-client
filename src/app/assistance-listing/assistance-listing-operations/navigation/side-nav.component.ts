import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

@Component({
  moduleId: __filename,
  selector: 'fal-form-side-nav',
  templateUrl: 'side-nav.template.html'
})

export class SideNavComponent implements OnInit {
  currentUrl : string;
  currentSection: string;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.currentUrl = location.pathname;
    this.route.fragment.subscribe((fragment: string) => {
      this.currentSection = fragment;
    });
  }

  //  TODO: Add handling for exit and save [prompt] when moving between sections
}
