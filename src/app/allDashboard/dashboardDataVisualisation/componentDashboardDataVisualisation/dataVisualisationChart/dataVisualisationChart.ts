import {Component, Output, EventEmitter} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataVisualisationService} from '../../../../../service/dataVisualisationService';
import {Observable} from 'rxjs/Rx';
declare let d3: any;

declare var require: any;

@Component({
  selector: 'dataVisualisationChart',
  templateUrl: './dataVisualisationChart.html',
})

export class DataVisualisationChart {
    private options: any;
    private data: any;
    private sub: any;
    private loaderGif: any;
    private dataVisualisationService: DataVisualisationService;
    private done : boolean = false; // savoir si une requête est en cours est ainsi afficher un loader ou non.

    constructor(private route: ActivatedRoute, private router: Router, dataVisualisationService: DataVisualisationService) {
        this.dataVisualisationService = dataVisualisationService;
        Observable.forkJoin([
            this.dataVisualisationService.getRequest("SELECT COUNT(*) FROM Expression"),
            this.dataVisualisationService.getRequest("SELECT COUNT(*) FROM Ontologie"),
            this.dataVisualisationService.getRequest("SELECT COUNT(*) FROM Cri"),
            this.dataVisualisationService.getRequest("SELECT COUNT(*) FROM Etab"),
            this.dataVisualisationService.getRequest("SELECT COUNT(*) FROM Regle"),
            this.dataVisualisationService.getRequest("SELECT COUNT(*) FROM Rubrique"),
            this.dataVisualisationService.getRequest("SELECT COUNT(*) FROM Concept")
        ]).subscribe(
            values => {
                this.refreshChart(values);
            }
        );
    }

    //Passer dans l'ordre Expressions/Ontologies/Cris/Etabs/Regles/Rubriques
    //Appeller après un Observable.forkJoin
    refreshChart(values) {
        var nbs = [];
        var i = 0;
        while (i < 7) {
            nbs[i] = 0;
            if (values[i].result[0]['COUNT'])
                nbs[i] = values[i].result[0]['COUNT'];    
            i++;  
        } 
        this.data = [{
            key: "Count",
            values : [
                {label: "Expressions", value: nbs[0], "color":"#A0522D"},
                {label: "Ontologies", value: nbs[1], "color":"green"},
                {label: "Cri", value: nbs[2], "color":"#FF8C00"},
                {label: "Etabs", value: nbs[3], "color":"#1E90FF"},
                {label: "Règles", value: nbs[4], "color":"#FFD700"},
                {label: "Rubriques", value: nbs[5], "color":"#FA8072"},
                {label: "Concept", value: nbs[6], "color":"#FF3232"}
            ]
        }];
        this.done = true;
    }


    ngOnInit(){
        this.loaderGif = require("../../../../../images/loaderBB8.gif");
        const color = d3.scale.category20();
        this.options = {
            chart: {
                type: 'discreteBarChart',
                height: 490,
                width: 800, 
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 50,
                    left: 100
                },
                x: function(d){return d.label;},
                y: function(d){return d.value;},
                duration: 500,
                color: function(d) {return d.color;},
            }
        };

        this.sub = this.route.params.subscribe(params => {
            if (params['toFind'] && params['toFind'] != "undefined") {
                this.done = false;
                Observable.forkJoin([
                    this.dataVisualisationService.getRequest("SELECT COUNT(*) FROM Expression WHERE libelle LUCENE '"+ params['toFind'] + "*'"),
                    this.dataVisualisationService.getRequest("SELECT COUNT(*) FROM Ontologie WHERE libelle LUCENE '"+ params['toFind'] + "*'"),
                    this.dataVisualisationService.getRequest("SELECT COUNT(*) FROM Cri WHERE libelle LUCENE '"+ params['toFind'] + "*'"),
                    this.dataVisualisationService.getRequest("SELECT COUNT(*) FROM Etab WHERE denom LUCENE '"+ params['toFind'] + "*'"),
                    this.dataVisualisationService.getRequest("SELECT COUNT(*) FROM Regle WHERE titre LUCENE '"+ params['toFind'] + "*'"),
                    this.dataVisualisationService.getRequest("SELECT COUNT(*) FROM Rubrique WHERE libelle LUCENE '"+ params['toFind'] + "*'"),
                    this.dataVisualisationService.getRequest("SELECT COUNT(*) FROM Concept WHERE libelle LUCENE '"+ params['toFind'] + "*'")
                ]).subscribe(
                    values => {
                        this.refreshChart(values);
                    }
                );
            }
            if (params['rid'] && params['rid'] != "undefined" && params['type']) {
                this.done = false;
                switch (params['type']) {
                    case "cri":
                        Observable.forkJoin([
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie').in('Regroupe')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(*) FROM " + params['rid']),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Dispose')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie').in('Regroupe').in('Obligatoire')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Synonyme', 'Pertinent')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie')[@class = 'Expression'].out('Identifie')[@class = 'Concept'])) FROM " + params['rid'] + ')')
                        ]).subscribe(
                            values => {
                                this.refreshChart(values);
                            }
                        );
                        break;
                    case "rubrique":
                        Observable.forkJoin([
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Pertinent', 'Secondaire')[@class = 'Regle'].out('Obligatoire')).out('Regroupe') FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Pertinent', 'Secondaire')[@class = 'Regle'].out('Obligatoire')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Pertinent', 'Synonyme')[@class = 'Cri']) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Dispose')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Secondaire', 'Pertinent')[@class = 'Regle']) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(*) FROM " + params['rid']),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Pertinent', 'Secondaire')[@class = 'Regle'].out('Obligatoire').out('Regroupe').out('Identifie')[@class = 'Concept']) FROM " + params['rid'] + ')')
                        ]).subscribe(
                            values => {
                                this.refreshChart(values);
                            }
                        );
                        break;
                    case "regle":
                        Observable.forkJoin([
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Obligatoire').out('Regroupe')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Obligatoire')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Obligatoire').out('Regroupe').out('Identifie')[@class = 'Cri']) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Obligatoire').out('Regroupe').out('Identifie')[@class = 'Etab']) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(*) FROM " + params['rid']),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Secondaire', 'Pertinent')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Obligatoire').out('Regroupe').out('Identifie')[@class = 'Concept']) FROM " + params['rid'] + ')')
                        ]).subscribe(
                            values => {
                                this.refreshChart(values);
                            }
                        );
                        break;
                    case "ontologie":
                        Observable.forkJoin([
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Regroupe')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(*) FROM " + params['rid']),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Regroupe').out('Identifie')[@class = 'Cri']) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Regroupe').out('Identifie')[@class = 'Etab']) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Obligatoire')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Obligatoire').out('Secondaire', 'Pertinent')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Regroupe').out('Identifie')[@class = 'Concept']) FROM " + params['rid'] + ')')
                        ]).subscribe(
                            values => {
                                this.refreshChart(values);
                            }
                        );
                        break;
                    case "expression":
                         Observable.forkJoin([
                            this.dataVisualisationService.getRequest("SELECT COUNT(*) FROM " + params['rid']),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Regroupe')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Identifie')[@class = 'Cri']) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Identifie')[@class = 'Etab']) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Regroupe').in('Obligatoire')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Regroupe').in('Obligatoire').out('Secondaire', 'Pertinent')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Identifie')[@class = 'Concept']) FROM " + params['rid'] + ')')
                        ]).subscribe(
                            values => {
                                this.refreshChart(values);
                            }
                        );
                        break;
                    case "etab":
                        Observable.forkJoin([
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie').in('Regroupe')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Dispose')[@class = 'Cri']) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(*) FROM " + params['rid']),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie').in('Regroupe').in('Obligatoire')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Dispose')[@class = 'Rubrique']) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie').out('Identifie')[@class = 'Concept']) FROM " + params['rid'] + ')')
                        ]).subscribe(
                            values => {
                                this.refreshChart(values);
                            }
                        );
                        break;
                    case "concept":
                        Observable.forkJoin([                        
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie')[@class = 'Expression']) FROM " + params['rid'] + ') ORDER BY frequence_mensuelle desc'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie')[@class = 'Expression'].in('Regroupe')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie')[@class = 'Expression'].out('Identifie')[@class = 'Cri']) FROM " + params['rid'] + ')'),              
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie')[@class = 'Expression'].out('Identifie')[@class = 'Etab']) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie')[@class = 'Expression'].in('Regroupe')[NOT(libelle containsText 'BlocDenom')].in('Obligatoire')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie')[@class = 'Expression'].in('Regroupe')[NOT(libelle containsText 'BlocDenom')].in('Obligatoire').out('Secondaire', 'Pertinent')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT COUNT(*) FROM " + params['rid'])                        
                        ]).subscribe(
                            values => {
                                this.refreshChart(values);
                            }
                        );
                        break;
                    default:
                        var values = "";
                        this.refreshChart(values);
                        this.done = false;
                        break;
                }
            }
        });
    }
}