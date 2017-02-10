/**
*
* Ce composant permet pour l'instant de rien faire.
* Mais il peut être amener à afficher des informations Insee.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';

declare var require: any;

// import {ActivatedRoute, Router} from '@angular/router';
// import {NgGrid, NgGridItem} from 'angular2-grid';
// import {RequetePageListService} from '../../../../../service/requeteService';
// import {VarForElasticSearchService} from '../../../../../service/varForElasticSearchService';

@Component({
	selector   : 'informationsInsee',
	styles: [require('./informationsInsee.css'), require('../../../../../css/cssGlobal.css')],
	template: require('./informationsInsee.html')
})
export class InformationsInsee {

	// private sub: any;
	// private conf: any;
	// private responseRubrique: any;
	// private requeteService: RequetePageListService;
	// private varForElasticSearchService: VarForElasticSearchService; /// Service permettant de créer les requêtes élastic Search.

	// constructor(private route: ActivatedRoute, private router: Router, requeteService: RequetePageListService, varForElasticSearchService: VarForElasticSearchService){
	constructor(){
		// this.requeteService = requeteService;
		// this.varForElasticSearchService = varForElasticSearchService;
		// this.conf = require('../../../../../conf/conf.json');
	}
	ngOnInit(){
	}
}
