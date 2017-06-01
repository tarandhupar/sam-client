import { Component } from "@angular/core";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { FileExtractsService } from "api-kit/file-extracts/file-extracts.service";

@Component ({
  templateUrl: 'data-service.template.html'
})
export class DataServicePage {

  currentFileList:any = [];
  currentDomain = "";

  constructor(private fileExtractsService: FileExtractsService){}

  ngOnInit(){
    this.getFileList();
  }

  isFolder(fileNameKey){
    return fileNameKey.charAt(fileNameKey.length - 1) === '/';
  }

  getFileTypeClass(fileNameKey){
    return this.isFolder(fileNameKey)? "fa-folder": "fa-file-text-o";
  }

  updateFileList(fileNameKey){
    // update the file list only if a folder is selected
    if(this.isFolder(fileNameKey) || fileNameKey === ''){
      this.currentDomain = fileNameKey.substr(0, fileNameKey.length-1);
      this.getFileList();
    }
  }

  getFileList(){
    this.fileExtractsService.getFilesList(this.currentDomain).subscribe( data => {
      this.currentFileList = data._embedded.customS3ObjectSummaryList;
    });
  }

  isCurrentFolder(index){
    let hierarchyList = this.currentDomain.split('/');
    return index === hierarchyList.length - 1;
  }

  updateDomain(index){
    let hierarchyList = this.currentDomain.split('/');
    hierarchyList.length = index + 1;
    this.currentDomain = hierarchyList.join('/');
    this.getFileList();
  }
}
