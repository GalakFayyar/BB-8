/**
*
* Ce sous-composant permet d'afficher une sorte de widget de l'EtabRanker.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
// import {NgGrid, NgGridItem} from 'angular2-grid';
import {RequetePageListService} from '../../../../../service/requeteService';
// import {VarForElasticSearchService} from '../../../../../service/varForElasticSearchService';

declare var require: any;

@Component({
	selector   : 'miniEtabRanker',
	styles: [require('./miniEtabRanker.css'), require('../../../../../css/cssGlobal.css')],
	template: require('./miniEtabRanker.html')
})
export class MiniEtabRanker {

	private sub: any;
	private done: boolean = false;
	private numSiret : any;
	private quiQuoi: any;
	private id: any;
	private nameDashboard: any;
	private lockScreen: any;
	private filtres: any;
	private responseRequeteEtabRanker: any;
	// private conf: any;
	// private responseRubrique: any;
	private requeteService: RequetePageListService;
	// private varForElasticSearchService: VarForElasticSearchService; /// Service permettant de créer les requêtes élastic Search.

	// constructor(private route: ActivatedRoute, private router: Router, requeteService: RequetePageListService, varForElasticSearchService: VarForElasticSearchService){
	constructor(private route: ActivatedRoute, private router: Router, requeteService: RequetePageListService){
		this.requeteService = requeteService;
		// this.varForElasticSearchService = varForElasticSearchService;
		// this.conf = require('../../../../../conf/conf.json');
	}
	ngOnInit(){
		this.sub = this.route.params.subscribe(params => {
			this.numSiret = params['id'];
			this.quiQuoi = params['QuiQuoi'];
			this.id = params['id'];
			this.nameDashboard = params['nameDashboard'];
			this.lockScreen = params['lockScreen'];
			this.filtres = params['filtres'];
			this.requeteEtabRanker(this.numSiret);
		});
	}

	requeteEtabRanker(siret){
		this.done = false;
		let elastOptions = {
			"query": {
				"term": {
					"code_siret": {
						"value": siret
					}
				}
			}
		};
		this.requeteService.requeteEtabRanker(siret, elastOptions)
		.then(response => {
			this.responseRequeteEtabRanker = response;
			this.done = true;
			// this.responseRequeteEtabRanker.hits.total);
		}, error => console.error(error));
	}

	goEtabRanker(){
    	let link = ['/mainDashboard/dashboard',
			this.quiQuoi,
			this.id,
			'etabRanker',
			this.lockScreen,
			this.filtres
		];
        this.router.navigate(link);
    }
}
