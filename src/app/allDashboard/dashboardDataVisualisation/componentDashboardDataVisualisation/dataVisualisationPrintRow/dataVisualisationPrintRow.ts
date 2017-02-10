import {Component,OnDestroy} from '@angular/core';

import {AgRendererComponent} from 'ag-grid-ng2/main';

@Component({
    selector: 'dataVisualisationPrintRow',
    template: `{{params.value}}`
})
export class DataVisualisationPrintRow implements AgRendererComponent {
    public params:any;

    agInit(params:any):void {
        this.params = params;
    }
}