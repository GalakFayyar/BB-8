/**
*
* Ce composant permet de pouvoir affiché la liste des requêtes de même type.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';
import {RequetePageListService} from '../../../../../service/requeteService';
import {ActivatedRoute, Router} from '@angular/router';
import {VarForElasticSearchService} from '../../../../../service/varForElasticSearchService';

declare var require: any;

@Component({
	selector: 'listRequete',
	styles: [require('./listRequete.css'), require('../../../../../css/cssGlobal.css')],
	template: require('./listRequete.html')
})
export class ListRequete {
	@Input()
	responseInterpretation: any;

	private done: boolean = false;
	private sub: any;

	private varRequeteOnInput: any;

	private varForElasticSearchService: VarForElasticSearchService; /// Service permettant de créer les requêtes élastic Search.
	private requeteService: RequetePageListService;

	constructor(private router: Router, private route: ActivatedRoute, requeteService: RequetePageListService, varForElasticSearchService: VarForElasticSearchService){
    	this.requeteService = requeteService;
		this.varForElasticSearchService = varForElasticSearchService;
	}

	ngOnInit(){
		this.sub = this.route.params.subscribe(params => {
			this.requeteOnInputAladin3ET4(params['QuiQuoi']);
		});
	}

	requeteOnInputAladin3ET4(event){
		this.done = false;
		if (!event) { return;}
		let elastOptions = this.varForElasticSearchService.elastOptionAladin3ET4(event, "quiquois.key", 0, 10, "[]");
		this.requeteService.requeteOnInput(event, elastOptions, "/aladin3")
		.then(response => {
			this.varRequeteOnInput = response;
			this.done = true;
		}, error => console.error(error));
	}
}
