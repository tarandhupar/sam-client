import { Component, Input, OnChanges  } from '@angular/core';
/**
* ListResultsMessageComponent - Lists results message component
*/
@Component({
	selector: 'list-results-message',
	templateUrl:'list-results-message.template.html'
})
export class ListResultsMessageComponent implements OnChanges{
  @Input() total: number;
  @Input() currentPage: number;
  @Input() showing: number;
  message: string;
  
  ngOnChanges(){
    let total = this.total;
    let currentPage = this.currentPage;
    let showing = this.showing;
    if(total < showing){
      currentPage = 1;
      showing = total;
    }
    if(currentPage>1){
      let numberA = (currentPage-1) * showing;
      let numberB = numberA + showing;
      if(numberB > total){
        numberB = total;
      }
      this.message = "Showing " + numberA + " - " + numberB + " of " + total + " results";
    } else {
      this.message = "Showing " + showing + " of " + total + " results";
    }
  }
}
