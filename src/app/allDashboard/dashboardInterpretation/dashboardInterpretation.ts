/**
*
* Ce composant permet d'afficher le dashboard Interpretation.
* Par les sous-composant il va permettre d'aficher différents module permettant d'interpreter la requêtes.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgGrid, NgGridItem} from 'angular2-grid';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

declare var require: any;

@Component({
	selector: 'dashboardInterpretation',
	styles: [require('./dashboardInterpretation.css'), require('../../../css/cssGlobal.css')],
	template: require('./dashboardInterpretation.html')
})
export class DashboardInterpretation {
	
	/// Algolia 
	  	algoliasearch = require('algoliasearch');
	  	private client: any;
	  	private index: any;
		private reponseAutocompletion: any = [];
		private states : any = [];
		private data : any;
		
		private keyAlgolia : string;
		private idAlgolia : string;
		private indexAlgolia : any = [];
	///
	
	private sub: any;
	private query: string;
	private displayComparaison: boolean = false;
	private anyLibelle: boolean = false;
	private lock: boolean = false; // verouiller le deplacement des composants
	private quiQuoi: any;
	private id: any;
	private nameDashboard: any;
	private lockScreen: any;
	private filtres: any;
	
	constructor(private route: ActivatedRoute, private router: Router){

	}

	ngOnInit(){
		this.sub = this.route.params.subscribe(params => {
			if (params['lockScreen'] == 'false'){
				this.lock = false;
			}
			else {
				this.lock = true;
			}
			this.quiQuoi = params['QuiQuoi'];
			this.id = params['id'];
			this.nameDashboard = params['nameDashboard'];
			this.lockScreen = params['lockScreen'];
			this.filtres = params['filtres'];
			if (this.quiQuoi == "search Interpretation"){
				this.anyLibelle = true;
			}
			else {
				this.query = this.quiQuoi;
			}
		});
		this.client = this.algoliasearch("DSK3UFAXUT", "30a9c866c7245bafc39b9d3612ca1a95");
    	this.index = this.client.initIndex("PROD_QuiQuoiPub");
	}

	//// typehead
	public typeaheadOnSelect(e:any):void {
		this.search(e.item.name);
	}

	autocompl(etab){
    	
    	this.index = this.client.initIndex("PROD_QuiQuoiPub");
		this.states = [];

		var err: any;
		var content: any;

		var tab: any = [];
		this.data = new Observable(observer => {
			this.index.search(etab, function(err, content){
				for (let item of content.hits){
					tab.push({'name': item.libelle});
				}
				observer.next(tab);
				return (tab);
			});
		});
		let subscription = this.data.subscribe(
			value => this.states = value
		);
	}

	goToPrev(){
		let link = ['/mainDashboard/dashboard',
		this.quiQuoi,
		this.id,
		'aladin3',
		this.lockScreen,
		this.filtres
		];
		this.router.navigate(link);
	}

	clickDisplayComparaison(){
		if (this.displayComparaison == false){
			this.displayComparaison = true;
		}
		else if (this.displayComparaison == true){
			this.displayComparaison = false;
		}
	}

	goToBaseConnaissance(){
		let link = ['/mainDashboard/dashboard',
			"dashboardDataVisualisation"
		];
		this.router.navigate(link);
	}

	search(query){
		let link = ['/mainDashboard/dashboard',
		query,
		query,
		'intepretation',
		this.lockScreen,
		this.filtres
		];
		this.router.navigate(link);
	}
}
