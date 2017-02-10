/**
*
* Ce composant permet de faire appel à des sous-composants pour afficher la base de connaissance sous différentes forme.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataVisualisationService} from '../../../service/dataVisualisationService';

declare var require: any;

@Component({
  selector   : 'dashboardDataVisualisation',
  styles: [require('./dashboardDataVisualisation.css')],
  template: require('./dashboardDataVisualisation.html')
})

export class DashboardDataVisualisation {
    private query : string;
    private dataVisualisationService: DataVisualisationService;
    private findEtabs: any;
    private findCris: any;
    private findConcepts: any;
    private findExpressions: any;
    private findRubriques: any;
    private findOntologies: any;
    private findRegles: any;

    constructor(private route: ActivatedRoute, private router: Router, dataVisualisationService: DataVisualisationService){
        this.dataVisualisationService = dataVisualisationService;
    }

    ngOnInit(){
    }

    search(toFind){
        if (toFind == null || toFind == "undefined"){
            toFind = "";
        }
        let link = [
            '/mainDashboard/dashboard/dashboardDataVisualisation',
            toFind
        ];
        this.router.navigate(link);
    }

    createRubrique() {
        let an8 = (<HTMLInputElement>document.getElementById("rubrique_an8")).value;
        let libelle = (<HTMLInputElement>document.getElementById("rubrique_libelle")).value;
        let metierLibelle = (<HTMLInputElement>document.getElementById("rubrique_libelle_metier")).value;
        if (!an8 || !libelle || !metierLibelle)
            return;
        let body = JSON.stringify({
            "@class": "Rubrique",
            "id": an8,
            "libelle": libelle,
            "metierLibelle": metierLibelle
          });
        this.dataVisualisationService.postDocumentRequest(body).subscribe(result => {location.reload()}, err => alert("Erreur lors de la création du vertex"));
    }

    createCri() {
        let id = (<HTMLInputElement>document.getElementById("cri_id")).value;
        let libelle = (<HTMLInputElement>document.getElementById("cri_libelle")).value;
        if (!id || !libelle)
            return;
        let body = JSON.stringify({
            "@class": "Cri",
            "id": id,
            "libelle": libelle
          });
        this.dataVisualisationService.postDocumentRequest(body).subscribe(result => {location.reload()}, err => alert("Erreur lors de la création du vertex"));
    }
    
    createRegle() {
        let id = (<HTMLInputElement>document.getElementById("regle_id")).value;
        let titre = (<HTMLInputElement>document.getElementById("regle_titre")).value;
        let typologie = (<HTMLInputElement>document.getElementById("regle_typologie")).value;
        if (!titre || !typologie)
            return;
        let body = JSON.stringify({
            "@class": "Regle",
            "typologie": typologie,
            "id": id,
            "titre": titre
          });
        this.dataVisualisationService.postDocumentRequest(body).subscribe(result => {location.reload()}, err => alert("Erreur lors de la création du vertex"));
    }
    
    createOntologie() {
        let id = (<HTMLInputElement>document.getElementById("ontologie_id")).value;
        let libelle = (<HTMLInputElement>document.getElementById("ontologie_libelle")).value;
        if (!id || !libelle)
            return;
        let body = JSON.stringify({
            "@class": "Ontologie",
            "id": id,
            "libelle": libelle
          });
        this.dataVisualisationService.postDocumentRequest(body).subscribe(result => {location.reload()}, err => alert("Erreur lors de la création du vertex"));
    }
    
    createExpression() {
        let libelle = (<HTMLInputElement>document.getElementById("expression_libelle")).value;
        if (!libelle)
            return;
        let body = JSON.stringify({
            "@class": "Expression",
            "libelle": libelle
          });
        this.dataVisualisationService.postDocumentRequest(body).subscribe(result => {location.reload()}, err => alert("Erreur lors de la création du vertex"));
    }
    
    createEtab() {
        let id = (<HTMLInputElement>document.getElementById("etab_id")).value;
        let denom = (<HTMLInputElement>document.getElementById("etab_denom")).value;
        if (!id || !denom)
            return;
        let body = JSON.stringify({
            "@class": "Etab",
            "denom": denom,
            "id": id
          });
        this.dataVisualisationService.postDocumentRequest(body).subscribe(result => {location.reload()}, err => alert("Erreur lors de la création du vertex"));
    }
    
    createConcept() {
        let libelle = (<HTMLInputElement>document.getElementById("concept_libelle")).value;
        if (!libelle)
            return;
        let body = JSON.stringify({
            "@class": "Concept",
            "libelle": libelle
          });
        this.dataVisualisationService.postDocumentRequest(body).subscribe(result => {location.reload()}, err => alert("Erreur lors de la création du vertex"));
    }

    findEtab() {
        let denom = (<HTMLInputElement>document.getElementById("etab_find_denom")).value;
        if (!denom)
            this.findEtabs = null;
        else
            this.dataVisualisationService.getRequest("SELECT FROM Etab WHERE denom LUCENE '"+ denom + "*'").subscribe(
                result => {
                    this.findEtabs = result.result
                },
                err => console.error(err)
            );
    }

    createLinkEtab(rid) {
        var fromRid = (<string>(<any> this.route.snapshot.params).rid)
        var type = (<string>(<any> this.route.snapshot.params).type)
        if (type == "expression") {
            var body = JSON.stringify({
               "command": "create edge Identifie from " + decodeURIComponent(fromRid) + " to " + rid
            });            
        } else if (type == "cri") {
            var body = JSON.stringify({
               "command": "create edge Dispose from " + rid + " to " +  decodeURIComponent(fromRid) 
            });                 
        } else if (type == "rubrique") {
            var body = JSON.stringify({
               "command": "create edge Dispose from " + rid + " to " + decodeURIComponent(fromRid) 
            });                 
        }
        this.dataVisualisationService.postCommandRequest(body).subscribe(
            result => {
                location.reload()
            },
            err => alert("Erreur lors de la création du lien")
        );
    }

    findCri() {
        let libelle = (<HTMLInputElement>document.getElementById("cri_find_libelle")).value;
        if (!libelle)
            this.findCris = null;
        else
            this.dataVisualisationService.getRequest("SELECT FROM Cri WHERE libelle LUCENE '"+ libelle + "*'").subscribe(
                result => {
                    this.findCris = result.result
                },
                err => console.error(err)
            );
    }

    createLinkCri(rid) {
        var fromRid = (<string>(<any> this.route.snapshot.params).rid)
        var type = (<string>(<any> this.route.snapshot.params).type)
        if (type == "expression") {
            var body = JSON.stringify({
               "command": "create edge Identifie from " + decodeURIComponent(fromRid) + " to " + rid
            });            
        } else if (type == "rubrique") {
            var body = JSON.stringify({
               "command": "create edge Synonyme from " + rid + " to " +  decodeURIComponent(fromRid) 
            });                 
        } else if (type == "etab") {
            var body = JSON.stringify({
               "command": "create edge Dispose from " + decodeURIComponent(fromRid) + " to " + rid 
            });
        }
        this.dataVisualisationService.postCommandRequest(body).subscribe(result => {location.reload()}, err => alert("Erreur lors de la création du lien"));
    }

    findRubrique() {
        let libelle = (<HTMLInputElement>document.getElementById("rubrique_find_libelle")).value;
        if (!libelle)
            this.findRubrique = null;
        else
            this.dataVisualisationService.getRequest("SELECT FROM Rubrique WHERE libelle LUCENE '"+ libelle + "*'").subscribe(
                result => {
                    this.findRubriques = result.result
                },
                err => console.error(err)
            );
    }

    createLinkRubrique(rid) {
        var fromRid = (<string>(<any> this.route.snapshot.params).rid)
        var type = (<string>(<any> this.route.snapshot.params).type)
        if (type == "cri") {
            var body = JSON.stringify({
               "command": "create edge Pertinent from " + decodeURIComponent(fromRid) + " to " + rid
            });            
        } else if (type == "etab") {
            var body = JSON.stringify({
               "command": "create edge Dispose from " + decodeURIComponent(fromRid) + " to " + rid 
            });
        } else if (type == "regle") {
            var body = JSON.stringify({
               "command": "create edge Pertinent from " + decodeURIComponent(fromRid) + " to " + rid 
            });
        }
        this.dataVisualisationService.postCommandRequest(body).subscribe(result => {location.reload()}, err => alert("Erreur lors de la création du lien"));
    }

    findRegle() {
        let titre = (<HTMLInputElement>document.getElementById("regle_find_titre")).value;
        if (!titre)
            this.findRegles = null;
        else
            this.dataVisualisationService.getRequest("SELECT FROM Regle WHERE titre LUCENE '"+ titre + "*'").subscribe(
                result => {
                    this.findRegles = result.result
                },
                err => console.error(err)
            );
    }

    createLinkRegle(rid) {
        var fromRid = (<string>(<any> this.route.snapshot.params).rid)
        var type = (<string>(<any> this.route.snapshot.params).type)
        if (type == "rubrique") {
            var body = JSON.stringify({
               "command": "create edge Pertinent from " + rid + " to " +  decodeURIComponent(fromRid) 
            });                 
        } else if (type == "ontologie") {
            var body = JSON.stringify({
               "command": "create edge Obligatoire from " + rid + " to " +  decodeURIComponent(fromRid) 
            });
        }
        this.dataVisualisationService.postCommandRequest(body).subscribe(result => {location.reload()}, err => alert("Erreur lors de la création du lien"));
    }

    findOntologie() {
        let libelle = (<HTMLInputElement>document.getElementById("ontologie_find_libelle")).value;
        if (!libelle)
            this.findOntologies = null;
        else
            this.dataVisualisationService.getRequest("SELECT FROM Ontologie WHERE libelle LUCENE '"+ libelle + "*'").subscribe(
                result => {
                    this.findOntologies = result.result
                },
                err => console.error(err)
            );
    }

    createLinkOntologie(rid) {
        var fromRid = (<string>(<any> this.route.snapshot.params).rid)
        var type = (<string>(<any> this.route.snapshot.params).type)
        if (type == "regle") {
            var body = JSON.stringify({
               "command": "create edge Obligatoire from " + decodeURIComponent(fromRid) + " to " + rid
            });            
        } else if (type == "expression") {
            var body = JSON.stringify({
               "command": "create edge Regroupe from " + rid + " to " +  decodeURIComponent(fromRid) 
            });                 
        }
        this.dataVisualisationService.postCommandRequest(body).subscribe(result => {location.reload()}, err => alert("Erreur lors de la création du lien"));
    }

    findExpression() {
        let libelle = (<HTMLInputElement>document.getElementById("expression_find_libelle")).value;
        if (!libelle)
            this.findExpression = null;
        else
            this.dataVisualisationService.getRequest("SELECT FROM Expression WHERE libelle LUCENE '"+ libelle + "*'").subscribe(
                result => {
                    this.findExpressions = result.result
                },
                err => console.error(err)
            );
    }

    createLinkExpression(rid) {
        var fromRid = (<string>(<any> this.route.snapshot.params).rid)
        var type = (<string>(<any> this.route.snapshot.params).type)
        if (type == "ontologie") {
            var body = JSON.stringify({
               "command": "create edge Regroupe from " + decodeURIComponent(fromRid) + " to " + rid
            });            
        } else if (type == "concept") {
            var body = JSON.stringify({
               "command": "create edge Identifie from " + rid + " to " +  decodeURIComponent(fromRid) 
            });                 
        } else if (type == "etab") {
            var body = JSON.stringify({
               "command": "create edge Identifie from " + rid + " to " +  decodeURIComponent(fromRid) 
            });
        } else if (type == "cri") {
            var body = JSON.stringify({
               "command": "create edge Identifie from " + rid + " to " +  decodeURIComponent(fromRid) 
            }); 
        }
        this.dataVisualisationService.postCommandRequest(body).subscribe(result => {location.reload()}, err => alert("Erreur lors de la création du lien"));
    }

    findConcept() {
        let libelle = (<HTMLInputElement>document.getElementById("concept_find_libelle")).value;
        if (!libelle)
            this.findConcepts = null;
        else
            this.dataVisualisationService.getRequest("SELECT FROM Concept WHERE libelle LUCENE '"+ libelle + "*'").subscribe(
                result => {
                    this.findConcepts = result.result
                },
                err => console.error(err)
            );
    }

    createLinkConcept(rid) {
        var fromRid = (<string>(<any> this.route.snapshot.params).rid)
        var type = (<string>(<any> this.route.snapshot.params).type)
        if (type == "expression") {
            var body = JSON.stringify({
               "command": "create edge Identifie from " + decodeURIComponent(fromRid) + " to " + rid
            });            
        }
        this.dataVisualisationService.postCommandRequest(body).subscribe(result => {location.reload()}, err => alert("Erreur lors de la création du lien"));
    }
}