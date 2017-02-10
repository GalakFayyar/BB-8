/**
*
* Il appele un autre composant parmi deux pour afficher les filtres déjà séléctionné.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

declare var require: any;

@Component({
	selector   : 'filtresSelectionner',
	styles: [require('./filtresSelectionner.css'), require('../../../css/cssGlobal.css')],
	template: require('./filtresSelectionner.html'),
})
export class FiltresSelectionner {

	/// variables
	private sub : any;
	private confFiltres: any;
	private indexElastic: string = "";
	///

	constructor(private router: Router, private route: ActivatedRoute){
		this.confFiltres = require('../../../conf/filtresAladin3.json');
	}

	ngOnInit(){
		this.sub = this.route.params.subscribe(params => {
			this.indexElastic = params['indexElastic']; /// vu que l'on est dans le composant enfant on ne peut pas récupérer un paramétre appartenant au composant parent avec la voie normal. Pour ceci on utilise "this.route.snapshot.parent.params['...']".
		});
	}
}