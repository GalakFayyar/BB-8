import {Component, Output, EventEmitter} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
declare let d3: any;

declare var require: any;

@Component({
  selector: 'dataVisualisationGraph',
  templateUrl: './dataVisualisationGraph.html',
})

export class DataVisualisationGraph {
    private options: any;
    private data: any;
    private sub: any;
    public Nodes: any;

    constructor(private route: ActivatedRoute, private router: Router) {
        this.Nodes = 
            [
                {"id":"Règles", "color":"#FFD700", "charge":120},
                {"id":"Rubriques", "color":"#FA8072", "charge":150},
                {"id":"Cris", "color":"#FF8C00", "charge":170},
                {"id":"Ontologies", "color":"green", "charge":100},
                {"id":"Expressions", "color":"#A0522D", "charge":180},
                {"id":"Etabs", "color":"#1E90FF", "charge":200},
                {"id":"Concepts", "color":"#FF3232", "charge":220}
            ];
        var Links = 
            [
                {"source":"Règles", "target":"Rubriques", "value":"Secondaire/Pertinent"},
                {"source":"Règles", "target":"Ontologies", "value":"Obligatoire"},
                {"source":"Cris", "target":"Rubriques", "value":"Synonyme/Pertinent"},
                {"source":"Etabs", "target":"Rubriques", "value":"Dispose"},
                {"source":"Etabs", "target":"Cris", "value":"Dispose"},
                {"source":"Expressions", "target":"Cris", "value":"Identifie"},
                {"source":"Expressions", "target":"Etabs", "value":"Identifie"},
                {"source":"Ontologies", "target":"Expressions", "value":"Regroupe"},
                {"source":"Expressions", "target":"Concepts", "value":"Identifie"}
            ];
        this.updateData(Links);
    }

    private updateData(Links) {
        var edges = [];
        var Nodes = this.Nodes;
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

    ngOnInit(){
        this.options = {
            chart: {
                "type": "forceDirectedGraph",
                "height": 490,
                "width": 805,
                color: function(d){
                    return (d.color);
                },
                nodeExtras: function(node) {
                    node && node
                    .append("text")
                    .attr("dx", 8)
                    .attr("dy", ".35em")
                    .text(function(d) { return d.id })
                    .style('font-size', '15px');
                }
            }
        };

        this.sub = this.route.params.subscribe(params => {
            if (params['toFind'] && params['toFind'] != "undefined") {
                var Links = 
                    [
                        {"source":"Règles", "target":"Rubriques", "value":"Secondaire/Pertinent"},
                        {"source":"Règles", "target":"Ontologies", "value":"Obligatoire"},
                        {"source":"Cris", "target":"Rubriques", "value":"Synonyme/Pertinent"},
                        {"source":"Etabs", "target":"Rubriques", "value":"Dispose"},
                        {"source":"Etabs", "target":"Cris", "value":"Dispose"},
                        {"source":"Expressions", "target":"Cris", "value":"Identifie"},
                        {"source":"Expressions", "target":"Etabs", "value":"Identifie"},
                        {"source":"Ontologies", "target":"Expressions", "value":"Regroupe"},
                        {"source":"Expressions", "target":"Concepts", "value":"Identifie"}
                    ];
                this.updateData(Links);
            }
            if (params['rid'] && params['rid'] != "undefined" && params['type']) {
                switch (params['type']) {
                    case "cri":
                        var Links = 
                            [
                                {"source":"Cris", "target":"Rubriques", "value":"Synonyme/Pertinent"},
                                {"source":"Cris", "target":"Etabs", "value":"Dispose"},
                                {"source":"Cris", "target":"Expressions", "value":"Identifie"},
                                {"source":"Rubriques", "target": "Règles","value":"Secondaire/Pertinent"},
                                {"source":"Expressions", "target":"Ontologies", "value":"Regroupe"},
                                {"source":"Expressions", "target":"Concepts", "value":"Identifie"}
                            ];
                        this.updateData(Links);
                        break;
                    case "rubrique":
                        var Links = 
                            [
                                {"source":"Règles", "target":"Rubriques", "value":"Secondaire/Pertinent"},
                                {"source":"Règles", "target":"Ontologies", "value":"Obligatoire"},
                                {"source":"Cris", "target":"Rubriques", "value":"Synonyme/Pertinent"},
                                {"source":"Etabs", "target":"Rubriques", "value":"Dispose"},
                                {"source":"Ontologies", "target":"Expressions", "value":"Regroupe"},
                                {"source":"Expressions", "target":"Concepts", "value":"Identifie"}
                            ];
                        this.updateData(Links);
                        break;
                    case "regle":
                         var Links = 
                            [
                                {"source":"Règles", "target":"Rubriques", "value":"Secondaire/Pertinent"},
                                {"source":"Règles", "target":"Ontologies", "value":"Obligatoire"},
                                {"source":"Expressions", "target":"Cris", "value":"Identifie"},
                                {"source":"Expressions", "target":"Etabs", "value":"Identifie"},
                                {"source":"Ontologies", "target":"Expressions", "value":"Regroupe"},
                                {"source":"Expressions", "target":"Concepts", "value":"Identifie"}
                            ];
                        this.updateData(Links);
                        break;
                    case "ontologie":
                        var Links = 
                            [
                                {"source":"Règles", "target":"Rubriques", "value":"Secondaire/Pertinent"},
                                {"source":"Règles", "target":"Ontologies", "value":"Obligatoire"},
                                {"source":"Expressions", "target":"Cris", "value":"Identifie"},
                                {"source":"Expressions", "target":"Etabs", "value":"Identifie"},
                                {"source":"Ontologies", "target":"Expressions", "value":"Regroupe"},
                                {"source":"Expressions", "target":"Concepts", "value":"Identifie"}
                            ];
                        this.updateData(Links);
                        break;
                    case "expression":
                        var Links = 
                            [
                                {"source":"Règles", "target":"Rubriques", "value":"Secondaire/Pertinent"},
                                {"source":"Règles", "target":"Ontologies", "value":"Obligatoire"},
                                {"source":"Expressions", "target":"Cris", "value":"Identifie"},
                                {"source":"Expressions", "target":"Etabs", "value":"Identifie"},
                                {"source":"Ontologies", "target":"Expressions", "value":"Regroupe"},
                                {"source":"Expressions", "target":"Concepts", "value":"Identifie"}
                            ];
                        this.updateData(Links);
                        break;
                    case "etab":
                        var Links = 
                            [
                                {"source":"Règles", "target":"Ontologies", "value":"Obligatoire"},
                                {"source":"Etabs", "target":"Rubriques", "value":"Dispose"},
                                {"source":"Etabs", "target":"Cris", "value":"Dispose"},
                                {"source":"Expressions", "target":"Etabs", "value":"Identifie"},
                                {"source":"Ontologies", "target":"Expressions", "value":"Regroupe"},
                                {"source":"Expressions", "target":"Concepts", "value":"Identifie"}
                            ];
                        this.updateData(Links);
                        break;
                    default:
                        this.data = "";
                        break;
                }
            }
        });
    }
}