import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ViewChild, ElementRef, OnChanges } from '@angular/core';
import { OptionsType } from '../form-controls/types';

@Component({
    selector: 'samMultiSelectDropdown',
    templateUrl: 'multiselect-dropdown.template.html',
    styleUrls: ['multiselect-dropdown.scss']
})
export class SamMultiSelectDropdownComponent implements OnChanges {

    @Input() model: any = [];
    @Input() options: OptionsType;
    @Input() label: string;
    @Input() name: string;
    @Input() hint: string;
    @Input() errorMessage: string;
    @Input() hasSelectAll: boolean;

    @Output() modelChange: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('optionsList') list: ElementRef;

    public elementLabel: string;

    constructor( ) { }

    ngOnChanges( ) {
        switch (this.model.length) {
            case 1:
                this.elementLabel = this.model[0];
                break;
            case 0:
                this.elementLabel = this.label;
                break;
            default:
                this.elementLabel = 'Multiple Selected';
                break;
        }
    }

    toggleItemList(event) {
        if (this.isEnterEvent(event)) {
            let element = this.list.nativeElement;
            element.style.visibility = element.style.visibility !== 'visible' ? 'visible' : 'hidden';
        }
    }

    isEnterEvent(event) {
        // Returns true if event is click or key code is enter (32) or space (13)
        return event.type === 'click' || event.keyCode === 32 || event.keyCode === 13;
    }

    onMoveOutside( ) {
        if (this.list.nativeElement.style.visibility === 'visible') {
            this.list.nativeElement.style.visibility = 'hidden';
        }
    }

    modelChanged(event) {
        switch(event.length) {
            case 1:
                this.elementLabel = event[0];
                break;
            case 0:
                this.elementLabel = this.label;
                break;
            default:
                this.elementLabel = 'Multiple Selected';
                break;
        }
        this.modelChange.emit(event);
    }
}
