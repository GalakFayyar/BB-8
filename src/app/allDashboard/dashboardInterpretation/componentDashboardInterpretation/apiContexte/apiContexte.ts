/**
*
* ce composant affiche la réponse de l'api contexte.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RequetePageListService} from '../../../../../service/requeteService';
import {VarForElasticSearchService} from '../../../../../service/varForElasticSearchService';

declare var require: any;

@Component({
	selector: 'apiContexte',
	styles: [require('./apiContexte.css'), require('../../../../../css/cssGlobal.css')],
	template: require('./apiContexte.html')
})
export class ApiContexte {
	@Input()
	responseInterpretation: any;

	private done: boolean = false;
	private responseApiContexte: any;
	private sub: any;
	private query: any;

	private varForElasticSearchService: VarForElasticSearchService; /// Service permettant de créer les requêtes élastic Search.
	private requeteService: RequetePageListService;
	private nbResultat: any = [];
	private size: number = 5;

	private cri : any = [];
	private scoreCri : any = [];
	private mots : any = [];
	private scoreMots : any = [];
	private rubriques : any = [];
	private scoreRubriques : any = [];
	private rubriques_docs : any = [];
	private scoreRubriques_docs : any = [];
	private rubriques_fines: any = [];
	private scoreRubriques_fines : any = [];
	private rubriques_generiques: any = [];
	private scoreRubriques_generiques : any = [];

	constructor(private router: Router, private route: ActivatedRoute, requeteService: RequetePageListService, varForElasticSearchService: VarForElasticSearchService){
    	this.requeteService = requeteService;
		this.varForElasticSearchService = varForElasticSearchService;
	}

	ngOnInit(){
		this.nbResultat =  [{'nb': 5}, {'nb': 10}, {'nb': 50}];
		this.sub = this.route.params.subscribe(params => {
			this.query = params['QuiQuoi'];
			this.requeteApiContexte(this.query);
		});
	}

	search(event){		
		this.requeteApiContexte(event);
	}

	requeteApiContexte(event){
		this.done = false;
		if (!event) { return;}
		this.requeteService.requeteApiContexte(event, this.size)
            .subscribe(
            	response => this.addResponses(response),
            	err => console.error(err)
        );
	}

	setNbResult(nb){
		this.size = nb;
	}

	addResponses(response){
		this.cri = [];
		this.scoreCri = [];
		this.mots = [];
		this.scoreMots = [];
		this.rubriques = [];
		this.scoreRubriques = [];
		this.rubriques_docs = [];
		this.scoreRubriques_docs = [];

		this.responseApiContexte = response;

		var result = [];
	    for (var key in response.cri) {
			this.cri.push(key);
	    }
	    for (let item of this.cri){
			this.scoreCri.push(this.responseApiContexte.cri[item]);
	    }

	    for (var key in response.mots) {
			this.mots.push(key);
	    }
	    for (let item of this.mots){
			this.scoreMots.push(this.responseApiContexte.mots[item]);
	    }

	    for (var key in response.rubriques) {
			this.rubriques.push(key);
	    }
	    for (let item of this.rubriques){
			this.scoreRubriques.push(this.responseApiContexte.rubriques[item]);
	    }

	    for (var key in response.rubriques_docs) {
			this.rubriques_docs.push(key);
	    }
	    for (let item of this.rubriques_docs){
			this.scoreRubriques_docs.push(this.responseApiContexte.rubriques_docs[item]);
	    }

	    for (var key in response.rubriques_fines) {
			this.rubriques_fines.push(key);
	    }
	    for (let item of this.rubriques_fines){
			this.scoreRubriques_fines.push(this.responseApiContexte.rubriques_fines[item]);
	    }

	    for (var key in response.rubriques_generiques) {
			this.rubriques_generiques.push(key);
	    }
	    for (let item of this.rubriques_generiques){
			this.scoreRubriques_generiques.push(this.responseApiContexte.rubriques_generiques[item]);
	    }

	    this.responseApiContexte = [];
	    this.responseApiContexte.push(
	    	{
	    		"cri":{
	    			"cri": this.cri,
	    			"score": this.scoreCri
	    		},
	    		"mots" : {
	    			"mots": this.mots,
	    			"score": this.scoreMots
	    		},
	    		"rubriques" : {
	    			"rubriques": this.rubriques,
	    			"score": this.scoreRubriques
	    		},
	    		"rubriques_docs" : {
	    			"rubriques_docs": this.rubriques_docs,
	    			"score": this.scoreRubriques_docs
	    		},
	    		"rubriques_fines" : {
	    			"rubriques_fines": this.rubriques_fines,
	    			"score": this.scoreRubriques_fines
	    		},
	    		"rubriques_generiques" : {
	    			"rubriques_generiques": this.rubriques_generiques,
	    			"score": this.scoreRubriques_generiques
	    		}
	    	}
	    );
		this.done = true;
	}
}
