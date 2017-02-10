import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgGrid, NgGridItem} from 'angular2-grid';
import {DataVisualisationService} from '../../../../../service/dataVisualisationService';

declare var require: any;

@Component({
  selector   : 'dataVisualisationRegles',
  styles: [require('./dataVisualisationRegles.css'), require('../../dashboardDataVisualisation.css')],
  template: require('./dataVisualisationRegles.html')
})

export class DataVisualisationRegles {
    private regles: any;
    private sub: any;
    private dataVisualisationService: DataVisualisationService;
    private done : boolean = true; // savoir si une requête est en cours est ainsi afficher un loader ou non.
    private loaderGif : any;
    private activeItem : string;
    private filDariane;
    private nbRegles = 0;

    constructor(private route: ActivatedRoute, private router: Router, dataVisualisationService: DataVisualisationService) {
        this.dataVisualisationService = dataVisualisationService;
    }

    ngOnInit(){
        this.loaderGif = require("../../../../../images/loaderBB8.gif");
        this.sub = this.route.params.subscribe(params => {
            if (params['toFind'] && params['toFind'] != "undefined") {
                this.filDariane = "";
                this.activeItem = "";
                this.getCount("SELECT COUNT(*) FROM Regle WHERE titre LUCENE '"+ params['toFind'] + "*'")
                this.getElem("SELECT FROM Regle WHERE titre LUCENE '"+ params['toFind'] + "*'")
            }
            if (params['rid'] && params['rid'] != "undefined" && params['type']) {
                this.activeItem = params['type'];
                switch (params['type']) {
                    case "cri":
                        this.filDariane = ["Cri" , "Expression" , "Ontologie" , "Regle"];
                        this.getCount("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie')[@class = 'Expression'].in('Regroupe').in('Obligatoire')) FROM " + params['rid'] + ')')
                        this.getElem("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie')[@class = 'Expression'].in('Regroupe').in('Obligatoire')) FROM " + params['rid'] + ')')
                        
                        break;
                    case "rubrique":
                        this.filDariane = ["Rubrique" , "Regle"];
                        this.getCount("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Secondaire', 'Pertinent')[@class = 'Regle']) FROM " + params['rid'] + ')')
                        this.getElem("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Secondaire', 'Pertinent')[@class = 'Regle']) FROM " + params['rid'] + ')')
                        break;
                    case "regle":
                        this.filDariane = "";
                        this.getCount("SELECT COUNT(*) FROM " + params['rid'])
                        this.getElem("SELECT FROM " + params['rid'])
                        break;
                    case "ontologie":
                        this.filDariane = ["Ontologie" , "Regle"];
                        this.getCount("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Obligatoire')) FROM " + params['rid'] + ')')
                        this.getElem("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Obligatoire')) FROM " + params['rid'] + ')')
                        break;
                    case "expression":
                        this.filDariane = ["Expression" , "Ontologie (Sans BlocDenom)" , "Regle"];
                        this.getCount("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Regroupe')[NOT(libelle containsText 'BlocDenom')].in('Obligatoire')) FROM " + params['rid'] + ')')
                        this.getElem("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Regroupe')[NOT(libelle containsText 'BlocDenom')].in('Obligatoire')) FROM " + params['rid'] + ')')
                        break;
                    case "etab":
                        this.filDariane = ["Etab" , "Expression" , "Ontologie (Sans BlocDenom)" , "Regle"];
                        this.getCount("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie')[@class = 'Expression'].in('Regroupe')[NOT(libelle containsText 'BlocDenom')].in('Obligatoire')) FROM " + params['rid'] + ')')
                        this.getElem("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie')[@class = 'Expression'].in('Regroupe')[NOT(libelle containsText 'BlocDenom')].in('Obligatoire')) FROM " + params['rid'] + ')')
                        break;
                    case "concept":
                        this.filDariane = ["Concept", "Expression" , "Ontologie (Sans BlocDenom)" , "Regle"];
                        this.getCount("SELECT COUNT(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie')[@class = 'Expression'].in('Regroupe')[NOT(libelle containsText 'BlocDenom')].in('Obligatoire')) FROM " + params['rid'] + ')')
                        this.getElem("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie')[@class = 'Expression'].in('Regroupe')[NOT(libelle containsText 'BlocDenom')].in('Obligatoire')) FROM " + params['rid'] + ')')
                        break;
                    default:
                        this.filDariane = "";
                        this.regles = "",
                        this.nbRegles = 0;
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
                this.regles = result.result,
                this.done = true
            },
            err => console.error(err)
        );
    }

    getCount(query) {
        this.done = false;
        this.dataVisualisationService.getRequest(query).subscribe(
            result => {
                this.nbRegles = result.result[0]['COUNT'],
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
                    if (this.activeItem == "rubrique" || this.activeItem == "ontologie") {
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
            var link :string[] = ['/mainDashboard/dashboard/dashboardDataVisualisation/regle/', encodeURIComponent(rid)];
        this.router.navigate(link);
    }
}
