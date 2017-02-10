/**
*
* Ce composant permet de choir un composant parmi deux pour séléctionner les filtres
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

declare var require: any;

@Component({
	selector   : 'filtresASelectionner',
	styles: [require('./filtresASelectionner.css'), require('../../../css/cssGlobal.css')],
	template: require('./filtresASelectionner.html'),
})
export class FiltresASelectionner {

	/// variables
	private sub : any;
	private confFiltresAladin3: any;
	private filtreAvancerActiv : boolean = false;
	private filtreBasicActiv : boolean = true;
	private indexElastic: string = "";
	///

	/// img
	private flecheHaut: any;
	private flecheBas: any;
	///

	constructor(private router: Router, private route: ActivatedRoute){
		this.confFiltresAladin3 = require('../../../conf/filtresAladin3.json');
	}

	ngOnInit(){
		/// image
		this.flecheHaut = require('../../../images/flecheHaut.png');
		this.flecheBas = require('../../../images/flecheBas.png');
		///
		this.sub = this.route.params.subscribe(params => {
			this.indexElastic = params['indexElastic'];
		});
	}
}