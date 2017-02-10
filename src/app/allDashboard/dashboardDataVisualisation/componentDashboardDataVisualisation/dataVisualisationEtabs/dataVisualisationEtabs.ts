import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgGrid, NgGridItem} from 'angular2-grid';
import {DataVisualisationService} from '../../../../../service/dataVisualisationService';

declare var require: any;

@Component({
  selector   : 'dataVisualisationEtabs',
  styles: [require('./dataVisualisationEtabs.css'), require('../../dashboardDataVisualisation.css')],
  template: require('./dataVisualisationEtabs.html')
})

export class DataVisualisationEtabs {
    private etabs: any;
    private sub: any;
    private dataVisualisationService: DataVisualisationService;
    private done : boolean = true; // savoir si une requête est en cours est ainsi afficher un loader ou non.
    private loaderGif : any;
    private activeItem : string;
    private filDariane;
    private nbEtabs = 0;

    constructor(private route: ActivatedRoute, private router: Router, dataVisualisationService: DataVisualisationService) {
        this.dataVisualisationService = dataVisualisationService;
    }

    ngOnInit(){
        this.loaderGif = require("../../../../../images/loaderBB8.gif");
        this.sub = this.route.params.subscribe(params => {
            if (params['toFind'] && params['toFind'] != "undefined") {
                this.filDariane = "";
                this.activeItem = "";
                this.getCount("SELECT COUNT(*) FROM Etab WHERE denom LUCENE '"+ params['toFind'] + "*'")
                this.getElem("SELECT FROM Etab WHERE denom LUCENE '"+ params['toFind'] + "*'")
            }
            if (params['rid'] && params['rid'] != "undefined" && params['type']) {
                this.activeItem = params['type'];
                switch (params['type']) {
                    case "cri":
                        this.filDariane = ["Cri" , "Etab"];
                        this.getCount("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Dispose')) FROM " + params['rid'] + ')')
                        this.getElem("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Dispose')) FROM " + params['rid'] + ')')
                        break;
                    case "rubrique":
                        this.filDariane = ["Rubrique" , "Etab"];
                        this.getCount("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Dispose')) FROM " + params['rid'] + ')')
                        this.getElem("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Dispose')) FROM " + params['rid'] + ')')
                        break;
                    case "regle":
                        this.filDariane = ["Regle" , "Ontologie" , "Expression" , "Etab"];
                        this.getCount("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Obligatoire').out('Regroupe').out('Identifie')[@class = 'Etab']) FROM " + params['rid'] + ')')
                        this.getElem("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Obligatoire').out('Regroupe').out('Identifie')[@class = 'Etab']) FROM " + params['rid'] + ')')
                        break;
                    case "ontologie":
                        this.filDariane = ["Ontologie" , "Expression" , "Etab"];
                        this.getCount("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Regroupe').out('Identifie')[@class = 'Etab']) FROM " + params['rid'] + ')')
                        this.getElem("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Regroupe').out('Identifie')[@class = 'Etab']) FROM " + params['rid'] + ')')
                        break;
                    case "expression":
                        this.filDariane = ["Expression" , "Etab"];
                        this.getCount("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Identifie')[@class = 'Etab']) FROM " + params['rid'] + ')')
                        this.getElem("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Identifie')[@class = 'Etab']) FROM " + params['rid'] + ')')
                        break;
                    case "etab":
                        this.filDariane = "";
                        this.getCount("SELECT COUNT(*) FROM " + params['rid'])
                        this.getElem("SELECT FROM " + params['rid'])
                        break;
                    case "concept":
                        this.filDariane = ["Concept" , "Expression" , "Etab"];
                        this.getCount("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie')[@class = 'Expression'].out('Identifie')[@class = 'Etab']) FROM " + params['rid'] + ')')
                        this.getElem("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie')[@class = 'Expression'].out('Identifie')[@class = 'Etab']) FROM " + params['rid'] + ')')
                        break;
                    default:
                        this.filDariane = "";
                        this.etabs = "",
                        this.nbEtabs = 0;
                        this.done = true 
                        break;
                }
            }
        });
    }

    getCount(query) {
        this.done = false;
        this.dataVisualisationService.getRequest(query).subscribe(
            result => {
                this.nbEtabs = result.result[0]['COUNT'],
                this.done = true
            },
            err => console.error(err)
        );
    }

    getElem(query) {
        this.done = false;
        this.dataVisualisationService.getRequest(query).subscribe(
            result => {
                this.etabs = result.result,
                this.done = true
            },
            err => console.error(err)
        );
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
                    if (this.activeItem == "expression") {
                        var toRid = encodeURIComponent(rid)
                        var fromRid = (<string>(<any> this.route.snapshot.params).rid)
                    } else if (this.activeItem == "rubrique" || this.activeItem == "cri") {
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

    search(rid) {
        if (rid == null || rid == "undefined"){
            var link :string[] = ['/mainDashboard/dashboard/dashboardDataVisualisation'];
        }
        else
            var link :string[] = ['/mainDashboard/dashboard/dashboardDataVisualisation/etab/', encodeURIComponent(rid)];
        this.router.navigate(link);
    }
}
