/**
*
* Ce sous-composant affiche la liste des CRI et la liste des Marques avec possibilité de recherche.
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
	selector   : 'criEtMarques',
	styles: [require('./criEtMarques.css'), require('../../../../../css/cssGlobal.css')],
	template: require('./criEtMarques.html')
})
export class CriEtMarques {
	/// images
	private loaderGif: any;
	///

	private done: boolean = false;
	private wait: boolean = false;

	private sub: any;
	private conf: any;
	private confIndex: any;
	private responseOnInputRubrique: any;
	private responseCriEtMarques_Cri: any;
	private responseCriEtMarques_Marques: any;
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
			this.requeteCriEtMarques_Cri(code_an8);
		}, error => console.error(error));
	}

	private tabCri : any = [];
	private cri : any;

	requeteCriEtMarques_Cri(code_an8){
		if (!code_an8) { return;}
		let elastOptions = {
			"filter": {
				"terms": {
					"rubriques.code_an8": [
					code_an8
					]
				}
			},
			"size": 500
		}
		this.requeteService.requeteCriEtMarques_Cri(code_an8, elastOptions)
		.then(response => {
			this.responseCriEtMarques_Cri = response;
			for (let item of this.responseCriEtMarques_Cri.hits.hits){
				this.tabCri.push({"libelle": item._source.libelle, "state": true});
			}
			this.requeteCriEtMarques_Marques(code_an8);
		}, error => console.error(error));
	}

	private tabMarques : any = [];
	private marque : any;

	requeteCriEtMarques_Marques(code_an8){
		if (!code_an8) { return;}
		let elastOptions = {
			"query": {
				"match": {
					"type_generique": "marques"
				}
			},
			"filter": {
				"terms": {
					"rubriques.code_an8": [
					code_an8
					]
				}
			},
			"size": 500
		}
		this.requeteService.requeteCriEtMarques_Marques(code_an8, elastOptions)
		.then(response => {
			this.responseCriEtMarques_Marques = response;
			for (let item of this.responseCriEtMarques_Marques.hits.hits){
				this.tabMarques.push({"libelle": item._source.libelle, "state": true});
			}
			this.done = true;
			this.wait = false;
		}, error => console.error(error));
	}

	filtreCRI(event) {
	    var i;
	    for (let item of this.tabCri) {
	        if (item.libelle.toLowerCase().indexOf(event.toLowerCase()) > -1) {
	            item.state = true;
	        } else {
	        	item.state = false;
	        }
	    }
	}

	filtreMarques(event) {
	    var i;
	    for (let item of this.tabMarques) {
	        if (item.libelle.toLowerCase().indexOf(event.toLowerCase()) > -1) {
	            item.state = true;
	        } else {
	        	item.state = false;
	        }
	    }
	}
}
