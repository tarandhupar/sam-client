import { Component, ViewChild } from '@angular/core';
import { FormControl,NgForm } from '@angular/forms';

@Component({
  templateUrl: 'simple-form-demo.template.html'
})
export class SimpleFormDemoPage{
    private text1 = "";
    private selectModel = "";
    private selectConfig = {
        options: [
            {value: '', label: 'Default option', name: 'empty', disabled: true},
            {value: 'dc', label: 'Washington DC', name: 'dc'},
            {value: 'ma', label: 'Maryland', name: 'maryland'},
            {value: 'va', label: 'Virginia', name: 'virginia'},
        ],
        disabled: false,
        label: 'region',
        name: 'region',
    };
    private text3 = "";
    private formText = "";
    @ViewChild('f') f:NgForm;
    save(form){
        console.log(form,"....");
        if(form.valid){
            this.formText = "Submission Success";
        } else {
            this.formText = "Submission Failed";
        }   
        
        // api submission goes here
    }
    clear(){
        this.formText = "";
    }
    handler(obj){
        console.log("FORM EVT - ",obj);

        if(obj.event == "cancel"){
            this.formText = "cancel action";
        } else if (obj.event == "submit"){
            this.formText = "submit action";
        }
    }
    
}