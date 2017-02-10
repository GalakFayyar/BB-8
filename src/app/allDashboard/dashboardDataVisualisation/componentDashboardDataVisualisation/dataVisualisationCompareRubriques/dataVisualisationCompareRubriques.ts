import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataVisualisationService} from '../../../../../service/dataVisualisationService';
import {Observable} from 'rxjs/Rx';

declare var require: any;

@Component({
  selector   : 'dataVisualisationCompareRubriques',
  styles: [require('./dataVisualisationCompareRubriques.css'), require('../../dashboardDataVisualisation.css')],
  template: require('./dataVisualisationCompareRubriques.html')
})

export class DataVisualisationCompareRubriques {
    private dataVisualisationService: DataVisualisationService;
    private done : boolean = false; // savoir si une requête est en cours est ainsi afficher un loader ou non.
    private loaderGif : any;
    private data : any;
    private sub: any;
    private currentElem: any;
    private libellesSynonymes: any;
    private libellesSynonymesComplet: any;
    private libellesLemme: any;

    constructor(private route: ActivatedRoute, private router: Router, dataVisualisationService: DataVisualisationService) {
        this.dataVisualisationService = dataVisualisationService;
    }

    ngOnInit(){
        this.loaderGif = require("../../../../../images/loaderBB8.gif");
        this.sub = this.route.params.subscribe(params => {
            if (params['rid'] && params['rid'] != "undefined") {
                var rid = encodeURIComponent(params['rid'])
                Observable.forkJoin([
                    this.dataVisualisationService.getRequest("SELECT FROM " + rid),
                    this.dataVisualisationService.getRequest("SELECT expand(out('Synonyme')) FROM " + rid),
                    this.dataVisualisationService.getRequest("SELECT expand(out('SynonymeComplet')) FROM " + rid),
                    this.dataVisualisationService.getRequest("SELECT expand(out('Lemme')) FROM " + rid)
                ]).subscribe(
                    values => {
                        this.currentElem = values[0].result[0],
                        this.libellesSynonymes = values[1].result,
                        this.libellesSynonymesComplet = values[2].result,
                        this.libellesLemme = values[3].result,
                        this.done = true
                    }
                );
            }
        });
    }

    getElem(query) {
        this.done = false;
        this.dataVisualisationService.getRequest(query).subscribe(
            result => {
                this.currentElem = result.result,
                this.done = true
            },
            err => console.error(err)
        );
    }

    goToBaseDeConnaissance() {
        let link = [
            '/mainDashboard/dashboard/dashboardDataVisualisation'
        ];
        this.router.navigate(link);
    }

     goToBaseDeConnaissanceRid(rid) {
        rid = encodeURIComponent(rid);
        let link = [
            '/mainDashboard/dashboard/dashboardDataVisualisation/expression', rid
        ];
        this.router.navigate(link);
    }
}

