import { Component } from '@angular/core';
import { Router,NavigationExtras } from '@angular/router';
@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'home',  // <home></home>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [ ],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './home.style.css' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './home.template.html'
})
export class Home {
  indexes = ['', 'cfda', 'fbo'];
  index = '';
  keyword: string = "";
  // Set our default values
  testValue = { value: 'Test' };
  // TypeScript public modifiers
  constructor(private _router:Router) {

  }

  ngOnInit() {
    console.log('hello `Home` component');
    // this.title.getData().subscribe(data => this.data = data);
  }
  runSearch(){
    var qsobj = {};
    if(this.keyword.length>0){
      qsobj['keyword'] = this.keyword;
    }
    if(this.index.length>0){
      qsobj['index'] = this.index;
    }
    let navigationExtras: NavigationExtras = {
      queryParams: qsobj
    };
    this._router.navigate(['/search'], navigationExtras );
    
    return false;
  }

}
