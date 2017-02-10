import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgGrid, NgGridItem} from 'angular2-grid';
import {DataVisualisationService} from '../../../../../service/dataVisualisationService';

declare var require: any;

@Component({
  selector   : 'dataVisualisationRequetes',
  styles: [require('./dataVisualisationRequetes.css'), require('../../dashboardDataVisualisation.css')],
  template: require('./dataVisualisationRequetes.html')
})

export class DataVisualisationRequetes {
    private requests: any;
    private sub: any;
    private dataVisualisationService: DataVisualisationService;
    private res: any;
    private done : boolean = true; // savoir si une requête est en cours est ainsi afficher un loader ou non.
    private loaderGif : any;
    private type:any;
    private current_request_name:any;

    constructor(private route: ActivatedRoute, private router: Router, dataVisualisationService: DataVisualisationService) {
        this.dataVisualisationService = dataVisualisationService;
        this.res = null;
        this.type = null;
    }

    ngOnInit(){
        this.loaderGif = require("../../../../../images/loaderBB8.gif");
        this.requests = [
            {
                "name":'Cri orphelin',
                "request":'select * FROM Cri WHERE in("Dispose").size() = 0'
            },
            {
                "name":"Cri obsolètes",
                "request":'select * FROM Cri WHERE in("Identifie").size() = 0'
            },
            {
                "name":"Expressions qui sont liées à des rubriques en passant par une regle et liées à des etab",
                "request":'select * FROM Expression WHERE in("Regroupe").in().out("Secondaire", "Pertinent").size() > 0 AND out("Identifie")[@class = "Etab"].size() > 0'
            },
            {
                "name":"Expressions codex liées à des rubriques qui ne sont pas liées en passant par les règles d'ADNc",
                "request":'select * from Expression WHERE profondeur_codex is not NULL AND out("Pertinent").size() > 0 AND in("Regroupe").in("Obligatoire").out("Pertinent").size() = 0'
            },
            {
                "name":"Expressions codex non liées à une recherche PJ",
                "request":'select * from Expression WHERE profondeur_codex is not NULL AND frequence_mensuelle is NULL'
            },
            {
                "name":"Expressions codex non liées à une rubrique mais qui au travers des règles ADNc peuvent être liées à une rubrique obligatoire",
                "request":'select * from Expression WHERE profondeur_codex is not NULL AND out("Pertinent").size() = 0 AND in("Regroupe").in("Obligatoire").out("Pertinent").size() > 0'
            },
            {
                "name":"Expressions codex qui sont aussi l'expression d'un cri",
                "request":'select * from Expression WHERE out("Identifie")[@class = "Cri"].size() > 0'
            },
            {
                "name":"Expressions qui sont des requêtes, des denom d'étab et des entrées du référentiel delphes",
                "request":'select * FROM Expression WHERE frequence_mensuelle is not NULL AND out("Identifie")[@class = "Etab"].size() > 0 AND in("Regroupe").size() > 0'
            },
            {
                "name":"Requêtes sans lien avec le référentiel delphes ni etab",
                "request":'select * FROM Expression WHERE both().size() = 0 AND frequence_mensuelle is not NULL'
            },
            {
                "name":"Expressions qui ne sont pas des requêtes",
                "request":'select * FROM Expression WHERE frequence_mensuelle is NULL'
            },
        ]
    }

    getElem(item) {

        this.done = false;
        this.dataVisualisationService.getRequest(item.request).subscribe(
            result => {
                this.current_request_name = item.name,
                this.res = result.result,
                this.type = this.res[0]['@class'].toLowerCase(),
                this.done = true;
            },
            err => console.error(err)
        );
    }
    
    search(item) {
        var rid = item['@rid'];
        if (rid == null || rid == "undefined"){
            var link :string[] = ['/mainDashboard/dashboard/dashboardDataVisualisation'];
        }
        else
            var link :string[] = ['/mainDashboard/dashboard/dashboardDataVisualisation/', item['@class'].toLowerCase(), encodeURIComponent(rid)];
        this.router.navigate(link);
    }

    previous() {
        this.res = null;
    }
}
