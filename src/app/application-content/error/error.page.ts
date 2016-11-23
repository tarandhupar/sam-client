import { Component } from '@angular/core';

@Component({
  template: `
    <div class="usa-grid">
      <!-- the first child cannot have a margin or the overlay breaks -->
      <div style="height: 12px;"></div>
      <h1 class="m_0">Error: something went wrong</h1>
    </div>
  `
})
export class GenericErrorPage {

}
