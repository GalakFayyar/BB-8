/**
*
* Ce composant permet d'afficher l'api intéprétation.
* On peut retrouvé un lien en haut à droite du composant renvoyant vers une autre route de BB-8,
* qui est le composant dashboardInterprétation.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RequetePageListService} from '../../../../../service/requeteService';

import myGlobals = require('../../../../../globals');

declare var require: any;

@Component({
  selector   : 'interpretation',
  styles: [require('./interpretation.css'), require('../../../../../css/cssGlobal.css')],
  template: require('./interpretation.html')
})
export class Interpretation {
	/// images
		private loaderGif: any;
	///

	/// variables
		private wait : boolean = false; // savoir si une requête est en cours est ainsi afficher un loader ou non.
		private done : boolean = false; // savoir si une requête est en cours est ainsi afficher un loader ou non.
		private sub : any;
		private connect: boolean = false;
		private apiInterpretation: any;
		private quiQuoi: any;
		private id: any;
		private nameDashboard: any;
		private lockScreen: any;
		private filtres: any;
		private requeteService: RequetePageListService;
	///

	constructor(requeteService: RequetePageListService, private route: ActivatedRoute, private router: Router){
		this.requeteService = requeteService;
	}

	ngOnInit(){
		var varCurrentSearch : any;
		this.loaderGif = require("../../../../../images/loaderBB8.gif");
		if (myGlobals.connect == true){
			this.connect = true;
		}
		else {
			this.connect = false;
		}
		
		this.sub = this.route.params.subscribe(params => {
			this.getApiInterpretation(params['QuiQuoi']);
			this.quiQuoi = params['QuiQuoi'];
			this.id = params['id'];
			this.nameDashboard = params['nameDashboard'];
			this.lockScreen = params['lockScreen'];
			this.filtres = params['filtres'];
		});
	}

	getApiInterpretation(quiQuoi) {
		this.wait = true;
		this.done = false;
        this.requeteService.getApiInterpretation(quiQuoi)
            .subscribe(
            	getIntepre => {
            		this.apiInterpretation = getIntepre,
          			this.done = true
            	},
            	err => console.error(err)
        );
    }

    goToAtelier(){
    	let link = ['/mainDashboard/dashboard',
			this.quiQuoi,
			this.id,
			'intepretation',
			this.lockScreen,
			this.filtres
		];
        this.router.navigate(link);
    }

    goToRubrique(query, libelle){
		let link = ['/mainDashboard/dashboard',
			libelle,
			query,
			'rubrique',
			this.lockScreen,
			this.filtres
		];
		this.router.navigate(link);
    }
}