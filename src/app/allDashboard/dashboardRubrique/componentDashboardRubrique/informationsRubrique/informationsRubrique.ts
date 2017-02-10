/**
*
* Ce sous-composant affiche des information liés à la rubrique qui sont divisé en trois sous-composants,
* disposé à dans ce repertoire.
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
	selector   : 'informationsRubrique',
	styles: [require('./informationsRubrique.css'), require('../../../../../css/cssGlobal.css')],
	template: require('./informationsRubrique.html')
})
export class InformationsRubrique {
	/// images
	private loaderGif: any;
	///
	private done: boolean = false;
	private wait: boolean = false;

	private sub: any;
	private conf: any;
	private confIndex: any;
	private responseOnInputRubrique: any;
	private responseRubrique: any;
	private quatorzeF: boolean = true;
	private contrib: boolean = false;
	private filtres: boolean = false;
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

	requeteOnInputRubrique(code_an8, champCible, champCible2, indexForRequete){
		this.done = false;
		this.wait = true;
		if (!code_an8) { return;}
		let elastOptions = this.varForElasticSearchService.elastOptionRubrique(code_an8, champCible, champCible2, indexForRequete, 1, "[]");
		this.requeteService.requeteOnInputUrlRub(code_an8, elastOptions, this.confIndex.index.rubriques)
		.then(response => {
			this.responseOnInputRubrique = response;
			this.requeteRubrique(code_an8);
		}, error => console.error(error));
	}

	requeteRubrique(code_an8){
		if (!code_an8) { return;}
		let elastOptions = {
			"filter": {
				"terms": {
					"code_an8": [
					code_an8
					]
				}
			}
		}
		this.requeteService.requeteRubrique(code_an8, elastOptions)
		.then(response => {
			this.responseRubrique = response;
			this.done = true;
			this.wait = false;
		}, error => console.error(error));
	}

	activ14F(){
		this.quatorzeF = true;
		this.contrib = false;
		this.filtres = false;
	}

	activContrib(){
		this.quatorzeF = false;
		this.contrib = true;
		this.filtres = false;
	}

	activFiltres(){
		this.quatorzeF = false;
		this.contrib = false;
		this.filtres = true;
	}
}
