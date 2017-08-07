import { Component, Input, OnInit } from '@angular/core';
import { PageService } from './page.service'

@Component({
  selector: 'page',
  templateUrl: 'page.template.html',
})
export class PageTemplateComponent implements OnInit{
  
  @Input() public breadcrumbs: any;
  @Input() public theme: string;
  @Input() public section: any;
  @Input() public title: any;
  
  constructor(private pageService: PageService){}
  
  ngOnInit(): void{
    // Reset sidebar
    this.pageService.sidebar = false;
    this.pageService.wideSidebar = false;
  }
  
}