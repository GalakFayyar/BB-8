/**
*
* Ce composant permet d'afficher le tableau pour les données rubrique.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';

import myGlobals = require('../../../../globals');

declare var require: any;

@Component({
	selector   : 'componentMainArrayRubrique',
	styles: [require('./componentMainArrayRubrique.css'), require('../../../../css/cssGlobal.css'), require('../tabCss.css')],
	template: require('./componentMainArrayRubrique.html')
})
export class ComponentMainArrayRubrique {
	@Input()
	varRequeteOnInput: any;
	
	private confFiltresAladin3: any;
	
	constructor(){
		this.confFiltresAladin3 = require('../../../../conf/filtresAladin3.json');
	}

	ngOnInit(){

	}

	saveParams(index){
		this.confFiltresAladin3.route[6].indexElastic = "/rubrique";
		this.confFiltresAladin3.route[6].nameSousRubrique = "Rubriques";
		this.confFiltresAladin3.route[6].nameRubriquesElasticSearch = "Référentiel/Données";
	}
}