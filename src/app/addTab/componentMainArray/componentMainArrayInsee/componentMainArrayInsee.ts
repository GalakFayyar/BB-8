/**
*
* Ce composant permet d'afficher le tableau pour les données insee.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';

import myGlobals = require('../../../../globals');

declare var require: any;

@Component({
	selector   : 'componentMainArrayInsee',
	styles: [require('./componentMainArrayInsee.css'), require('../../../../css/cssGlobal.css'), require('../tabCss.css')],
	template: require('./componentMainArrayInsee.html')
})
export class ComponentMainArrayInsee {
	@Input()
	varRequeteOnInput: any;

	private confFiltresAladin3: any;

	constructor(){
		this.confFiltresAladin3 = require('../../../../conf/filtresAladin3.json');
	}

	ngOnInit(){

	}

	saveParams(index){
		this.confFiltresAladin3.route[6].indexElastic = "/insee";
		this.confFiltresAladin3.route[6].nameSousRubrique = "Insee";
		this.confFiltresAladin3.route[6].nameRubriquesElasticSearch = "Insee";
	}
}