/**
*
* Ce composant permet d'afficher le tableau pour les données aladin3.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
// import { Angular2Csv } from 'angular2-csv/Angular2-csv';

import myGlobals = require('../../../../globals');

declare var require: any;

@Component({
	selector   : 'componentMainArrayAladin3',
	styles: [require('./componentMainArrayAladin3.css'), require('../../../../css/cssGlobal.css'), require('../tabCss.css')],
	template: require('./componentMainArrayAladin3.html')
})
export class ComponentMainArrayAladin3 {
	@Input()
	varRequeteOnInput: any;

	private sub: any;
	private index: string;
	private indexWithoutSlach: string;
	private paramRequeteFiltre: any;
	private confFiltresAladin3: any;
	private lock: boolean = false;

	// private data = [
	//   {
	//     name: "Test 1",
	//     age: 13,
	//     average: 8.2,
	//     approved: true,
	//     description: "using 'Content here, content here' "
	//   },
	//   {
	//     name: 'Test 2',
	//     age: 11,
	//     average: 8.2,
	//     approved: true,
	//     description: "using 'Content here, content here' "
	//   },
	//   {
	//     name: 'Test 4',
	//     age: 10,
	//     average: 8.2,
	//     approved: true,
	//     description: "using 'Content here, content here' "
	//   },
	// ];


	constructor (private router: Router, private route: ActivatedRoute){
		this.confFiltresAladin3 = require('../../../../conf/filtresAladin3.json');
		// new Angular2Csv(this.data, 'My Report');
	}

	ngOnInit(){
		this.sub = this.route.params.subscribe(params => {
			this.paramRequeteFiltre = this.route.snapshot.parent.params['filtres']; /// vu que l'on est dans le composant enfant on ne peut pas récupérer un paramétre appartenant au composant parent avec la voie normal. Pour ceci on utilise "this.route.snapshot.parent.params['...']".
			if (this.paramRequeteFiltre == "undefined"){
				(this.confFiltresAladin3.filtreSelectionner == "") ? (this.paramRequeteFiltre = "[]") : (this.paramRequeteFiltre = this.confFiltresAladin3.filtreSelectionner);
			}
			else {
				this.confFiltresAladin3.filtreSelectionner = JSON.parse(this.paramRequeteFiltre);
			}
			this.index = params['indexElastic'];
			this.indexWithoutSlach = params['indexElastic'].replace('/', '');
		});
	}


	saveParams(index){
			switch (this.index) {
				case "/aladin3":
					this.confFiltresAladin3.route[6].nameSousRubrique = "Données 30 jours courant";
					break;
				case "/aladin4":
					this.confFiltresAladin3.route[6].nameSousRubrique = "Données 150 jours courant";
					break;
				case "/aladin1":
					this.confFiltresAladin3.route[6].nameSousRubrique = "Données 30 jours précédent";
					break;
				case "/aladin2":
					this.confFiltresAladin3.route[6].nameSousRubrique = "Données 150 jours précédent";
					break;
				default:
					this.confFiltresAladin3.route[6].nameSousRubrique = "Données 30 jours courant";
					break;
			}
		this.confFiltresAladin3.route[6].indexElastic = this.index;
		// this.confFiltresAladin3.route[6].nameSousRubrique = "Données 30 jours courant";
		this.confFiltresAladin3.route[6].nameRubriquesElasticSearch = "Donnéesfixes";
	}
}