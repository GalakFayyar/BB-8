import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgGrid, NgGridItem} from 'angular2-grid';
import {DataVisualisationService} from '../../../../../service/dataVisualisationService';

declare var require: any;

@Component({
  selector   : 'dataVisualisationExpressions',
  styles: [require('./dataVisualisationExpressions.css'), require('../../dashboardDataVisualisation.css')],
  template: require('./dataVisualisationExpressions.html')
})

export class DataVisualisationExpressions {
    private expressions: Array<Object>;
    private sub: any;
    private dataVisualisationService: DataVisualisationService;
    private done : boolean = true; // savoir si une requête est en cours est ainsi afficher un loader ou non.
    private loaderGif : any;
    private activeItem : string;
    private filDariane;
    private nbExpressions = 0;

    constructor(private route: ActivatedRoute, private router: Router, dataVisualisationService: DataVisualisationService) {
        this.dataVisualisationService = dataVisualisationService;
    }

    ngOnInit(){
        this.loaderGif = require("../../../../../images/loaderBB8.gif");
        this.sub = this.route.params.subscribe(params => {
            if (params['toFind'] && params['toFind'] != "undefined") {
                this.filDariane = "";
                this.filDariane = "";
                this.activeItem = "";
                this.getCount("SELECT COUNT(*) FROM Expression WHERE libelle LUCENE '"+ params['toFind'] + "*' ORDER BY frequence_mensuelle desc")
                this.getElem("SELECT FROM Expression WHERE libelle LUCENE '"+ params['toFind'] + "*' ORDER BY frequence_mensuelle desc")
            }
            if (params['rid'] && params['rid'] != "undefined" && params['type']) {
                this.activeItem = params['type'];
                switch (params['type']) {
                    case "cri":
                        this.filDariane = ["Cri" , "Expression"];
                        this.getCount("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie')[@class = 'Expression']) FROM " + params['rid'] + ') ORDER BY frequence_mensuelle desc')
                        this.getElem("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie')[@class = 'Expression']) FROM " + params['rid'] + ') ORDER BY frequence_mensuelle desc')
                        break;
                    case "rubrique":
                        this.filDariane = ["Rubrique" , "Regle" , "Ontologie" , "Expression"];
                        this.getCount("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Pertinent', 'Secondaire')[@class = 'Regle'].out('Obligatoire').out('Regroupe')) FROM " + params['rid'] + ') ORDER BY frequence_mensuelle desc')
                        this.getElem("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Pertinent', 'Secondaire')[@class = 'Regle'].out('Obligatoire').out('Regroupe')) FROM " + params['rid'] + ') ORDER BY frequence_mensuelle desc')
                        break;
                    case "regle":
                        this.filDariane = ["Regle" , "Ontologie" , "Expression"];
                        this.getCount("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Obligatoire').out('Regroupe')) FROM " + params['rid'] + ') ORDER BY frequence_mensuelle desc')
                        this.getElem("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Obligatoire').out('Regroupe')) FROM " + params['rid'] + ') ORDER BY frequence_mensuelle desc')
                        break;
                    case "ontologie":
                        this.filDariane = ["Ontologie" , "Expression"];
                        this.getCount("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Regroupe')) FROM " + params['rid'] + ') ORDER BY frequence_mensuelle desc')
                        this.getElem("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Regroupe')) FROM " + params['rid'] + ') ORDER BY frequence_mensuelle desc')
                        break;
                    case "expression":
                        this.filDariane = "";
                        this.getCount("SELECT COUNT(*) FROM " + params['rid'] + ' ORDER BY frequence_mensuelle desc')
                        this.getElem("SELECT FROM " + params['rid'] + ' ORDER BY frequence_mensuelle desc')
                        break;
                    case "etab":
                        this.filDariane = ["Etab" , "Expression"];
                        this.getCount("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie')[@class = 'Expression']) FROM " + params['rid'] + ') ORDER BY frequence_mensuelle desc')
                        this.getElem("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie')[@class = 'Expression']) FROM " + params['rid'] + ') ORDER BY frequence_mensuelle desc')
                        break;
                    case "concept":
                        this.filDariane = [ "Concept", "Expression"];
                        this.getCount("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie')[@class = 'Expression']) FROM " + params['rid'] + ') ORDER BY frequence_mensuelle desc')
                        this.getElem("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie')[@class = 'Expression']) FROM " + params['rid'] + ') ORDER BY frequence_mensuelle desc')
                        break;
                    default:
                        this.filDariane = "";
                        this.expressions = null,
                        this.done = true 
                        break;
                }
            }
        });
    }

    getElem(query) {
        this.done = false;
        this.dataVisualisationService.getRequest(query).subscribe(
            result => {
                this.expressions = result.result,
                this.done = true
            },
            err => console.error(err)
        );
    }

    getCount(query) {
        this.done = false;
        this.dataVisualisationService.getRequest(query).subscribe(
            result => {
                this.nbExpressions = result.result[0]['COUNT'],
                this.done = true
            },
            err => console.error(err)
        );
    }

    search(rid) {
        if (rid == null || rid == "undefined"){
            var link :string[] = ['/mainDashboard/dashboard/dashboardDataVisualisation'];
        }
        else
            var link :string[] = ['/mainDashboard/dashboard/dashboardDataVisualisation/expression/', encodeURIComponent(rid)];
        this.router.navigate(link);
    }

    deleteLink(rid) {
        this.dataVisualisationService.getRequest("SELECT FROM " + encodeURIComponent(rid)).subscribe(
            result => {
                if (this.activeItem == result.result[0]['@class'].toLowerCase()) {
                    this.dataVisualisationService.deleteElemByRid(encodeURIComponent(rid)).subscribe(
                        result => {
                            var link :string[] = ['/mainDashboard/dashboard/dashboardDataVisualisation'];
                            this.router.navigate(link);
                        },
                        err => console.error(err)
                    );
                }
                else
                {
                    if (this.activeItem == "ontologie") {
                        var toRid = encodeURIComponent(rid)
                        var fromRid = (<string>(<any> this.route.snapshot.params).rid)
                    } else if (this.activeItem == "concept" || this.activeItem == "cri"  || this.activeItem == "etab") {
                        var toRid = (<string>(<any> this.route.snapshot.params).rid)
                        var fromRid = encodeURIComponent(rid)
                    }
                    this.dataVisualisationService.getRequest("SELECT @rid FROM (SELECT expand(outE()) FROM " + fromRid + ") WHERE in.@rid = " + toRid).subscribe(
                        result => {
                            this.dataVisualisationService.deleteElemByRid(encodeURIComponent(result.result[0]['rid'])).subscribe(
                                result => {
                                    location.reload();
                                },
                                err => console.error(err)
                            );
                        },
                        err => console.error(err)
                   );
                }
            },
            err => console.error(err)
        );
    }

    goToCompareRubrique(rid) {
        if (rid == null || rid == "undefined"){
            rid = "";
        }
        let link = [
            '/mainDashboard/dashboard/dashboardDataVisualisation/compareRubrique',
            rid
        ];
        this.router.navigate(link);
    }
}
