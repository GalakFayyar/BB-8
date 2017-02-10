/**
*
* Affiche la liste des top requêtes.
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
  selector   : 'topRequetes',
  styles: [require('./topRequetes.css'), require('../../../../../css/cssGlobal.css')],
  template: require('./topRequetes.html')
})
export class TopRequetes {
	
	private sub: any;
	private done: boolean = false;
	private conf: any;
	private confIndex: any;
	private varRequeteOnInput: any;
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
			this.requeteOnInputAladin3ET4(params['id']);
		});
	}

	requeteOnInputAladin3ET4(quiQuoi){
		this.done = false;
		let elastOptions = {
			"query":{
				"bool":{
					"must":[
					{
						"query_string":{
							"query": quiQuoi,
							"fields":["_all"],
							"default_operator":"AND"
						}
					}
					]
				}
			},
			"sort":[
			{
				"frequence_mensuelle":{
					"order":"desc"
				}
			}
			],
			"size":10,
			"from":0
		};
		this.requeteService.requeteOnInput(quiQuoi,  elastOptions, "/aladin3")
		.then(response => {
			this.varRequeteOnInput = response;
			this.done = true;
		}, error => console.error(error));
	}

	goToRequetes(query, id){
		let link = ['/mainDashboard/dashboard',
			query,
			id,
			'aladin3',
			false,
			"[]"
		];
		this.router.navigate(link);
	}
}
