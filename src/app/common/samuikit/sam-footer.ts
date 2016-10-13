import { Component, Input } from '@angular/core';

@Component({
  selector: 'samFooter',
  template:`<footer class="m_T-6x" id="sam-footer" aria-label="footer-navigation">
              <div class="sam-footer-wrapper">
                <nav class="usa-grid sam-footer-body">
                  <div class="sam-footer-logo usa-width-one-sixth">
                    <a href="http://www.gsa.gov"><span>General Services Administration Website</span></a>
                  </div>
                </nav>
              </div>
            </footer>`,
})
export class SamFooter {

  @Input() labelname: string;


  constructor() {
  }

  ngOnInit(){
  }
}



