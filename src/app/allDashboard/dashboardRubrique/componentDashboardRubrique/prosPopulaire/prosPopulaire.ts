/**
*
* Affiche la liste des pros populaire. On peut aussi cliqué sur l'un d'entre eux est arriver sur EtabRanker.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgGrid, NgGridItem} from 'angular2-grid';
import {RequetePageListService} from '../../../../../service/requeteService';
import {VarForElasticSearchService} from '../../../../../service/varForElasticSearchService';

declare var require: any;

@Component({
  selector   : 'prosPopulaire',
  styles: [require('./prosPopulaire.css'), require('../../../../../css/cssGlobal.css')],
  template: require('./prosPopulaire.html')
})
export class ProsPopulaire {
	/// images
		private loaderGif: any;
	///

	private done: boolean = false;
	private wait: boolean = false;

	private sub: any;
	private conf: any;
	private confIndex: any;
	private responseRubrique: any;
	private propPlusPopulaire: any;
	private code_an8: any;
	private requeteService: RequetePageListService;
	private varForElasticSearchService: VarForElasticSearchService; /// Service permettant de créer les requêtes élastic Search.

	constructor(private route: ActivatedRoute, private router: Router, requeteService: RequetePageListService, varForElasticSearchService: VarForElasticSearchService){
		this.requeteService = requeteService;
		this.varForElasticSearchService = varForElasticSearchService;
		this.conf = require('../../../../../conf/conf.json');
		this.confIndex = require('../../../../../conf/index.json');
	}
	ngOnInit(){
		this.loaderGif = require("../../../../../images/loaderBB8.gif");
		this.sub = this.route.params.subscribe(params => {
			this.requeteOnInputRubrique(params['id'], "_all", "nothing", 0);
		});
	}

	requeteOnInputRubrique(event, champCible, champCible2, indexForRequete){
		this.done = false;
		this.wait = true;
		if (!event) { return;}
		let elastOptions = this.varForElasticSearchService.elastOptionRubrique(event, champCible, champCible2, indexForRequete, 1, "[]");
		this.requeteService.requeteOnInputUrlRub(event, elastOptions, this.confIndex.index.rubriques)
		.then(response => {
			this.responseRubrique = response;
			this.requeteProPop(event);
		}, error => console.error(error));
	}

	requeteProPop(event){
		if (!event) { return;}
		this.recupCode_an8();
		let elastOptions = {
			"filter": {
				"terms": {
					"code_an8": [
					this.code_an8
					]
				}
			},
			"sort": [
			{
				"nb_clics": {
					"order": "desc"
				}
			}
			],
			"size": 10
		}
		this.requeteService.searchProPop(event, elastOptions)
		.then(response => {
			this.propPlusPopulaire = response;
			this.done = true;
			this.wait = false;
		}, error => console.error(error));
	}

	recupCode_an8(){
		for (let item of this.responseRubrique.hits.hits){
			this.code_an8 = item._source.code_an8;
		}
	}

	goEtabRanker(quiQuoi, id){
    	let link = ['/mainDashboard/dashboard',
			quiQuoi,
			id,
			'etabRanker',
			false,
			"[]"
		];
        this.router.navigate(link);
    }
}
