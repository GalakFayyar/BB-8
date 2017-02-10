/**
*
* Ce composant permet d'afficher l'EtabRanker.
* C'est un projet à part de BB-8, qui à été intégré.
* Pour l'intégration il y a juste eu besoin de copier coller le code
* et de changer une variable qui contient toutes les informations à afficher.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RequetePageListService} from '../../../service/requeteService';

declare var require: any;

@Component({
	selector   : 'dashboardEtabRanker',
	styles: [require('./dashboardEtabRanker.css'), require('../../../css/cssGlobal.css')],
	template: require('./dashboardEtabRanker.html')
})
export class DashboardEtabRanker {
	
	private sub: any;
	private done: boolean = false;
	private numSiret : any;
	private quiQuoi: any;
	private id: any;
	private nameDashboard: any;
	private lockScreen: any;
	private filtres: any;
	private dashboardActiv: boolean = true;
	private scoreActiv: boolean = false;
	private comparaisonActiv: boolean = false;
	private responseRequeteEtabRanker: any;
	private requeteService: RequetePageListService;

	constructor(private route: ActivatedRoute, private router: Router, requeteService: RequetePageListService){
		this.requeteService = requeteService;
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

    dashboard(){
    	this.dashboardActiv = true;
    	this.scoreActiv = false;
    	this.comparaisonActiv = false;
    }

    score(){
    	this.dashboardActiv = false;
    	this.scoreActiv = true;
    	this.comparaisonActiv = false;
    }

    comparaison(){
    	this.dashboardActiv = false;
    	this.scoreActiv = false;
    	this.comparaisonActiv = true;
    }
	
	goToPrev(){
		let link = ['/mainDashboard/dashboard',
		this.quiQuoi,
		this.id,
		'Insee',
		this.lockScreen,
		this.filtres
		];
		this.router.navigate(link);
	}
}