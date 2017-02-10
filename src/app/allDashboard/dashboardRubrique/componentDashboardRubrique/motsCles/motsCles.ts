/**
*
* Ce sous-composant affiche la liste des mots-clès.
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
  selector   : 'motsCles',
  styles: [require('./motsCles.css'), require('../../../../../css/cssGlobal.css')],
  template: require('./motsCles.html')
})
export class MotsCles {
	
	private sub: any;
	private done: boolean = false;
	private conf: any;
	private pasMotsCles: boolean = false;
	private confIndex: any;
	private varRequeteOnInput: any;
	private responseRubrique: any;
	private requeteService: RequetePageListService;
	private varForElasticSearchService: VarForElasticSearchService; /// Service permettant de créer les requêtes élastic Search.

	constructor(private route: ActivatedRoute, private router: Router, requeteService: RequetePageListService, varForElasticSearchService: VarForElasticSearchService){
		this.requeteService = requeteService;
		this.varForElasticSearchService = varForElasticSearchService;
		this.conf = require('../../../../../conf/conf.json');
		this.confIndex = require('../../../../../conf/index.json');
	}
	ngOnInit(){
		this.sub = this.route.params.subscribe(params => {
			this.requeteOnInputMotsClefs(params['id']);
		});
	}

	requeteOnInputMotsClefs(quiQuoi){
		this.done = false;
		let elastOptions = this.varForElasticSearchService.elastOptionMotsClefs(quiQuoi, "_all", "nothing", "0", "100");
		this.requeteService.requeteOnInput(quiQuoi, elastOptions, this.confIndex.index.motsClefs)
		.then(response => {
			this.varRequeteOnInput = response;
			if (this.varRequeteOnInput.hits.total == 0){
				this.pasMotsCles = true;
			}
			this.done = true;
		}, error => console.error(error));
	}
}
