/**
*
* Ce composant permet d'afficher le dashboard Rubrique.
* Il va appeler ces sous-composants qui chacun d'eux vont constitué un module. => Les sous-composants sont stocké dans le dossier componentDashboardRubrique.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgGrid, NgGridItem} from 'angular2-grid';
import {RequetePageListService} from '../../../service/requeteService';
import {VarForElasticSearchService} from '../../../service/varForElasticSearchService';
import {Cookie} from 'ng2-cookies/ng2-cookies';

declare var require: any;

@Component({
	selector   : 'dashboardRubrique',
	styles: [require('./dashboardRubrique.css')],
	template: require('./dashboardRubrique.html')
})
export class DashboardRubrique {

	private sub: any;
	private conf: any;
	private lock: boolean = false;
	private tabDisplayComposants: any = []; /// tableau pour savoir quel composant à afficher celui-ci est stocké dans un cookies
	private responseRubrique: any;
	private requeteService: RequetePageListService;
	private varForElasticSearchService: VarForElasticSearchService; /// Service permettant de créer les requêtes élastic Search.

	constructor(private route: ActivatedRoute, private router: Router, requeteService: RequetePageListService, varForElasticSearchService: VarForElasticSearchService){
		this.requeteService = requeteService;
		this.varForElasticSearchService = varForElasticSearchService;
		this.conf = require('../../../conf/conf.json');
	}
	ngOnInit(){
		if (Cookie.get('tabDisplayComposantsRubrique') != null){
			let cookies = Cookie.get('tabDisplayComposantsRubrique');
			this.tabDisplayComposants = JSON.parse(cookies);
		}
		else {
			this.tabDisplayComposants = [
				{"name": 'informationsRubrique', "state": true},
				{"name": 'criEtMarques', "state": true},
				{"name": 'motscles', "state": true},
				{"name": 'prosPopulaire', "state": true},
				{"name": 'topRequetes', "state": true}
			];
		}
		let tabDisplayComposantsString = JSON.stringify(this.tabDisplayComposants);
		Cookie.set('tabDisplayComposantsRubrique', tabDisplayComposantsString, 5);
		this.sub = this.route.params.subscribe(params => {
			if (params['lockScreen'] == 'false'){
				this.lock = false;
			}
			else {
				this.lock = true;
			}
		});
	}

	modifStateComposants(name){
		for (let item of this.tabDisplayComposants){
			if (item.name == name){
				(item.state == true) ? (item.state = false) : (item.state = true);
			}
		}
		let tabDisplayComposantsString = JSON.stringify(this.tabDisplayComposants);
		Cookie.set('tabDisplayComposantsRubrique', tabDisplayComposantsString, 5);
	}

	modifStateAllComposantsActiv(){
		/// Désactivation de toutes les colonnes.
		for (let item of this.tabDisplayComposants){
			item.state = true;
		}
		let tabDisplayComposantsString = JSON.stringify(this.tabDisplayComposants);
		Cookie.set('tabDisplayComposantsRubrique', tabDisplayComposantsString, 5);
	}

	modifStateAllComposantsNone(){
		for (let item of this.tabDisplayComposants){
			item.state = false;
		}
		let tabDisplayComposantsString = JSON.stringify(this.tabDisplayComposants);
		Cookie.set('tabDisplayComposantsRubrique', tabDisplayComposantsString, 5);
	}
}