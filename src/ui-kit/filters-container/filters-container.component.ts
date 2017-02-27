import { Component } from '@angular/core';

/**
 * Sam Filter Container Component
 * Component is used as a container for collapsible filters.
 * Child components included in this tag will conform to the styles applied on the container.
 */
@Component({
  selector: 'sam-filters-container',
  templateUrl: 'filters-container.template.html',
  styles: [`:host >>> .filters-container * {margin-bottom: 0.5rem;}
            :host >>> .collapsible-content{position: relative;}`] // Solves checkbox click area outside of container issue
})
export class SamFiltersContainerComponent {
  
}
