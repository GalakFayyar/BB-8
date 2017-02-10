import {Component, Output, EventEmitter} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {DataVisualisationService} from '../../../../../service/dataVisualisationService';
declare let d3: any;

declare var require: any;

@Component({
  selector: 'dataVisualisationGraphSelected',
  templateUrl: './dataVisualisationGraphSelected.html',
})

export class DataVisualisationGraphSelected {
    private options: any;
    private data: any;
    private sub: any;
    private dataVisualisationService: DataVisualisationService;
    private colorNodes: any;

    constructor(private route: ActivatedRoute, private router: Router, dataVisualisationService: DataVisualisationService) {
        this.dataVisualisationService = dataVisualisationService;
    }

    private updateData(Nodes, Links) {
        var edges = [];
        Links.forEach(function(e) { 
        var sourceNode = Nodes.filter(function(n) { return n.id === e.source; })[0],
        targetNode = Nodes.filter(function(n) { return n.id === e.target; })[0];
        if (sourceNode && targetNode)    
            edges.push({source: sourceNode, target: targetNode, value: e.value});
        });
        this.data = {
            "nodes":Nodes,
            "links":edges
        };
    }

     private createEdge(edges, source, className, linkName, targets){
        if (source["out_" + linkName] && className == source['@class'])
            source["out_" + linkName].forEach(function (e) {
                targets.forEach(function (target) {
                    if (target["in_" + linkName]){
                        if (target["in_" + linkName].indexOf(e) != -1)
                            edges.push({source: source['@rid'], target:target['@rid'], value:1});
                        }
                });
            });   
    }

    private createLink(values, selected) {
        var nodes = [];
        var edges = [];
        var cris = values[0].result;
        var rubriques = values[1].result;
        var regles = values[2].result;
        var ontologies = values[3].result;
        var expressions = values[4].result;
        var etabs = values[5].result;
        var concepts = values[6].result;
        values.forEach(function (value) {
            value.result.forEach(function (node) {

                //Create Nodes
                if (node['@class'] == "Expression")
                    nodes.push({id:node['@rid'], name:node['libelle'], charge:150, group:node['@class'], color:this.colorNodes[node['@class']]});
                if (node['@class'] == "Cri")
                    nodes.push({id:node['@rid'], name:node['libelle'], charge:150, group:node['@class'], color:this.colorNodes[node['@class']]});
                if (node['@class'] == "Rubrique")
                    nodes.push({id:node['@rid'], name:node['libelle'], charge:150, group:node['@class'], color:this.colorNodes[node['@class']]});
                if (node['@class'] == "Ontologie")
                    nodes.push({id:node['@rid'], name:node['libelle'], charge:150, group:node['@class'], color:this.colorNodes[node['@class']]});
                if (node['@class'] == "Etab")
                    nodes.push({id:node['@rid'], name:node['denom'], charge:150, group:node['@class'], color:this.colorNodes[node['@class']]});
                if (node['@class'] == "Regle")
                    nodes.push({id:node['@rid'], name:node['titre'], charge:150, group:node['@class'], color:this.colorNodes[node['@class']]});
                if (node['@class'] == "Concept")
                    nodes.push({id:node['@rid'], name:node['libelle'], charge:150, group:node['@class'], color:this.colorNodes[node['@class']]});
                //Create Links
                if (selected == "Cri") {
                    this.createEdge(edges, node, "Ontologie", "Regroupe", expressions);
                    this.createEdge(edges, node, "Regle", "Obligatoire", ontologies);
                    this.createEdge(edges, node, "Expression", "Identifie", cris);
                    this.createEdge(edges, node, "Etab", "Dispose", cris,);
                    this.createEdge(edges, node, "Cri", "Synonyme", rubriques);
                    this.createEdge(edges, node, "Cri", "Pertinent", rubriques);
                    this.createEdge(edges, node, "Expression", "Identifie", concepts);
                }
                if (selected == "Rubrique") {
                    this.createEdge(edges, node, "Ontologie", "Regroupe", expressions);
                    this.createEdge(edges, node, "Regle", "Obligatoire", ontologies);
                    this.createEdge(edges, node, "Regle", "Secondaire", rubriques);
                    this.createEdge(edges, node, "Regle", "Pertinent", rubriques);
                    this.createEdge(edges, node, "Cri", "Synonyme", rubriques);
                    this.createEdge(edges, node, "Cri", "Pertinent", rubriques);
                    this.createEdge(edges, node, "Etab", "Dispose", rubriques);
                    this.createEdge(edges, node, "Expression", "Identifie", concepts);
                }                
                if (selected == "Regle") {
                    this.createEdge(edges, node, "Regle", "Secondaire", rubriques);
                    this.createEdge(edges, node, "Regle", "Pertinent", rubriques);
                    this.createEdge(edges, node, "Regle", "Obligatoire", ontologies);
                    this.createEdge(edges, node, "Ontologie", "Regroupe", expressions);
                    this.createEdge(edges, node, "Expression", "Identifie", etabs);
                    this.createEdge(edges, node, "Expression", "Identifie", cris);
                    this.createEdge(edges, node, "Expression", "Identifie", concepts);
                }
                if (selected == "Ontologie") {
                    this.createEdge(edges, node, "Regle", "Obligatoire", ontologies);
                    this.createEdge(edges, node, "Regle", "Pertinent", rubriques);
                    this.createEdge(edges, node, "Regle", "Secondaire", rubriques);
                    this.createEdge(edges, node, "Ontologie", "Regroupe", expressions);
                    this.createEdge(edges, node, "Expression", "Identifie", cris);
                    this.createEdge(edges, node, "Expression", "Identifie", etabs);
                    this.createEdge(edges, node, "Expression", "Identifie", concepts);
                }                
                if (selected == "Expression") {
                    this.createEdge(edges, node, "Ontologie", "Regroupe", expressions);
                    this.createEdge(edges, node, "Regle", "Obligatoire", ontologies);
                    this.createEdge(edges, node, "Regle", "Pertinent", rubriques);
                    this.createEdge(edges, node, "Regle", "Secondaire", rubriques);
                    this.createEdge(edges, node, "Expression", "Identifie", etabs);
                    this.createEdge(edges, node, "Expression", "Identifie", cris);
                    this.createEdge(edges, node, "Expression", "Identifie", concepts);

                }                
                if (selected == "Etab") {
                    this.createEdge(edges, node, "Ontologie", "Regroupe", expressions);
                    this.createEdge(edges, node, "Regle", "Obligatoire", ontologies);
                    this.createEdge(edges, node, "Expression", "Identifie", etabs);
                    this.createEdge(edges, node, "Etab", "Dispose", rubriques);
                    this.createEdge(edges, node, "Etab", "Dispose", cris);
                    this.createEdge(edges, node, "Expression", "Identifie", concepts);
                }
            }, this, selected);
        }, this, selected);
        this.updateData(nodes, edges);
    }

    ngOnInit(){
        this.colorNodes =
            {
                "Regle" : "#FFD700",
                "Rubrique" : "#FA8072",
                "Cri" : "#FF8C00",
                "Ontologie" : "green",
                "Expression" : "#A0522D",
                "Etab" : "#1E90FF",
                "Concept" : "#FF3232"

            };
        this.options = {
            chart: {
                "type": "forceDirectedGraph",
                "height": 1000,
                "width": 1630,
                "tooltip": {
                  "duration": 100,
                  "gravity": "w",
                  "distance": 25,
                  "snapDistance": 0,
                  "classes": null,
                  "chartContainer": null,
                  "enabled": true,
                  "hideDelay": 200,
                  "headerEnabled": true,
                  "hidden": true,
                  "data": null,
                  "id": "nvtooltip-85145"
                },
                "linkStrength": 0.1,
                "friction": 0.9,
                "linkDist": 250,
                "gravity": 0.1,
                "theta": 0.8,
                "alpha": 0.1,
                "radius": 8,
                "noData": null,
                color: function(d){
                    return (d.color);
                },
                charge: function(d){
                    return (-2 * d.charge);
                },
                nodeExtras: function(node) {
                    node && node
                    .append("text")
                    .attr("dx", 8)
                    .attr("dy", ".35em")
                    .text(function(d) { return d.name })
                    .style('font-size', '15px');
                }
            }
        };

        this.sub = this.route.params.subscribe(params => {
            if (params['toFind'] && params['toFind'] != "undefined") {
            }
            if (params['rid'] && params['rid'] != "undefined" && params['type']) {
                switch (params['type']) {
                    case "cri":
                        Observable.forkJoin([
                            this.dataVisualisationService.getRequest("SELECT FROM " + params['rid']),
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Synonyme', 'Pertinent')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie').in('Regroupe').in('Obligatoire')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie').in('Regroupe')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie')[@class = 'Expression']) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Dispose')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie')[@class = 'Expression'].out('Identifie')[@class = 'Concept']) FROM " + params['rid'] + ')')
                        ]).subscribe(
                            values => {
                                this.createLink(values, "Cri");
                            }
                        );
                        break;
                    case "rubrique":
                        Observable.forkJoin([
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Pertinent', 'Synonyme')[@class = 'Cri']) FROM " + params['rid'] + ')'),             
                            this.dataVisualisationService.getRequest("SELECT FROM " + params['rid']),
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Secondaire', 'Pertinent')[@class = 'Regle']) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Secondaire', 'Pertinent')[@class = 'Regle'].out('Obligatoire')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Pertinent', 'Secondaire')[@class = 'Regle'].out('Obligatoire').out('Regroupe')) FROM " + params['rid'] + ' )'),
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Dispose')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Pertinent', 'Secondaire')[@class = 'Regle'].out('Obligatoire').out('Regroupe').out('Identifie')[@class = 'Concept']) FROM " + params['rid'] + ' )')

                        ]).subscribe(
                            values => {
                                this.createLink(values, "Rubrique");
                            }
                        );
                        break;
                    case "regle":
                        Observable.forkJoin([
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Obligatoire').out('Regroupe').out('Identifie')[@class = 'Cri']) FROM " + params['rid'] + ')'),       
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Secondaire', 'Pertinent')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT FROM " + params['rid']),
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Obligatoire')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Obligatoire').out('Regroupe')) FROM " + params['rid'] + ' )'),
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Obligatoire').out('Regroupe').out('Identifie')[@class = 'Etab']) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Obligatoire').out('Regroupe').out('Identifie')[@class = 'Concept']) FROM " + params['rid'] + ' )')
                        ]).subscribe(
                            values => {
                                this.createLink(values, "Regle");
                            }
                        );
                        break;
                    case "ontologie":
                        Observable.forkJoin([
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Regroupe').out('Identifie')[@class = 'Cri']) FROM " + params['rid'] + ')'),          
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Obligatoire').out('Secondaire', 'Pertinent')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Obligatoire')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT FROM " + params['rid']),
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Regroupe')) FROM " + params['rid'] + ' )'),
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Regroupe').out('Identifie')[@class = 'Etab']) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Regroupe').out('Identifie')[@class = 'Concept']) FROM " + params['rid'] + ' )')
                        ]).subscribe(
                            values => {
                                this.createLink(values, "Ontologie");
                            }
                        );
                        break;
                    case "expression":
                        Observable.forkJoin([
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Identifie')[@class = 'Cri']) FROM " + params['rid'] + ')'),           
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Regroupe')[NOT(libelle containsText 'BlocDenom')].in('Obligatoire').out('Secondaire', 'Pertinent')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Regroupe')[NOT(libelle containsText 'BlocDenom')].in('Obligatoire')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Regroupe')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT FROM " + params['rid']),
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Identifie')[@class = 'Etab']) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT EXPAND(out('Identifie')[@class = 'Concept']) FROM " + params['rid']),
                        ]).subscribe(
                            values => {
                                this.createLink(values, "Expression");
                            }
                        );
                        break;
                    case "etab":
                        Observable.forkJoin([
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Dispose')[@class = 'Cri']) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(out('Dispose')[@class = 'Rubrique']) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie').in('Regroupe')[NOT(libelle containsText 'BlocDenom')].in('Obligatoire')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie').in('Regroupe')) FROM " + params['rid'] + ')'),
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie')) FROM " + params['rid'] + ' )'),
                            this.dataVisualisationService.getRequest("SELECT FROM " + params['rid']),
                            this.dataVisualisationService.getRequest("SELECT EXPAND(DISTINCT(@rid)) FROM (SELECT EXPAND(in('Identifie').out('Identifie')[@class = 'Concept']) FROM " + params['rid'] + ' )'),
                            ]).subscribe(
                            values => {
                                this.createLink(values, "Etab");
                            }
                        );
                        break;
                    default:
                        break;
                }
            }
        });
    }
}