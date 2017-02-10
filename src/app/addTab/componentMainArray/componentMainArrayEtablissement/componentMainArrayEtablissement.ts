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

import myGlobals = require('../../../../globals');

declare var require: any;

@Component({
	selector   : 'componentMainArrayEtablissement',
	styles: [require('./componentMainArrayEtablissement.css'), require('../../../../css/cssGlobal.css'), require('../tabCss.css')],
	template: require('./componentMainArrayEtablissement.html')
})
export class ComponentMainArrayEtablissement {
	@Input()
	varRequeteOnInput: any;

	private sub: any;
	private index: string;
	private indexWithoutSlach: string;
	private paramRequeteFiltre: any;
	// private confFiltresAladin3: any;
	private lock: boolean = false;

	constructor (private router: Router, private route: ActivatedRoute){
		// this.confFiltresAladin3 = require('../../../../conf/filtresAladin3.json');
	}

	ngOnInit(){
		// this.sub = this.route.params.subscribe(params => {
		// 	this.paramRequeteFiltre = this.route.snapshot.parent.params['filtres']; /// vu que l'on est dans le composant enfant on ne peut pas récupérer un paramétre appartenant au composant parent avec la voie normal. Pour ceci on utilise "this.route.snapshot.parent.params['...']".
		// 	if (this.paramRequeteFiltre == "undefined"){
		// 		(this.confFiltresAladin3.filtreSelectionner == "") ? (this.paramRequeteFiltre = "[]") : (this.paramRequeteFiltre = this.confFiltresAladin3.filtreSelectionner);
		// 	}
		// 	else {
		// 		this.confFiltresAladin3.filtreSelectionner = JSON.parse(this.paramRequeteFiltre);
		// 	}
		// 	this.index = params['indexElastic'];
		// 	this.indexWithoutSlach = params['indexElastic'].replace('/', '');
		// });
	}
}