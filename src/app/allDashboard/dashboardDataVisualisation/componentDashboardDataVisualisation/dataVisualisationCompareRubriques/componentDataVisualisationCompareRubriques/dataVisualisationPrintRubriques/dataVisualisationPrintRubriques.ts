import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataVisualisationService} from '../../../../../../../service/dataVisualisationService';

import {GridOptions} from 'ag-grid/main';

@Component({
    selector: 'dataVisualisationPrintRubriques',
    templateUrl: 'dataVisualisationPrintRubriques.html'
})

export class DataVisualisationPrintRubriques {
    @Input()
    private rid: any;
    private dataVisualisationService: DataVisualisationService;
    private done : boolean = false; // savoir si une requête est en cours est ainsi afficher un loader ou non.

    public gridOptions:GridOptions;
    private sub: any;
    private loaderGif : any;

    constructor(private route: ActivatedRoute, private router: Router, dataVisualisationService: DataVisualisationService) {
        this.dataVisualisationService = dataVisualisationService;
        this.gridOptions = <GridOptions>{
            enableSorting : true,
            sortingOrder :  ['desc','asc',null],
            enableColResize : true,
            enableFilter : true,
            columnDefs : this.createColumnDefs(),
            rowData : []           
        };
    }

    ngOnInit(){
        var rid = encodeURIComponent(this.rid);
        this.loaderGif = require("../../../../../../../images/loaderBB8.gif");
        this.dataVisualisationService.getRequest("SELECT expand(distinct(@rid)) FROM (SELECT expand(in('Regroupe')[NOT(libelle containsText 'BlocDenom')].in().out('Pertinent', 'Secondaire')) FROM " + rid + " ORDER BY libelle ASC)").subscribe(
            values => {
                this.done = true,
                this.createRowData(values.result)
            }
        );
    }

    private createColumnDefs() {
        return [
            {headerName: "N°", colId: "row", field: "row", width : 50, minWidth: 50},
            {
                headerName: "id",
                field: "id",
                colId: "id",
                minWidth: 60,
                width : 100
            },
            {
                headerName: "libelle",
                field: "libelle",
                colId: "libelle",
                filter: 'text',
                filterParams: {apply: true, newRowsAction: 'keep'},
                minWidth: 180,
                width : 250
            },
            {
                headerName: "metierLibelle",
                field: "metierLibelle",
                colId: "metierLibelle",
                minWidth: 250,
                width : 300
            }
        ];
    }

    private createRowData(values) {
        let rowData:any[] = [];
        for (var i = 0; i < values.length; i++) {
            rowData.push({
                row: i,
                id: values[i].id,
                libelle: values[i].libelle,
                metierLibelle: values[i].metierLibelle
            });
        }
        this.gridOptions.api.addItems(rowData);

        let allColumnIds = [];
         this.gridOptions.columnDefs.forEach( function(columnDefs) {
            allColumnIds.push(columnDefs.headerName);
        });
        this.gridOptions.columnApi.autoSizeColumns(allColumnIds);
    }
}