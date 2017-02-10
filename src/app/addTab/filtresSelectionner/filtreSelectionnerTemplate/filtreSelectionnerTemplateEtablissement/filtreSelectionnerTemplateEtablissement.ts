/**
*
* Ce composant permet d'afficher les filtres que l'on à séléctionner Insee.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

declare var require: any;

@Component({
	selector   : 'filtreSelectionnerTemplateEtablissement',
	styles: [require('./filtreSelectionnerTemplateEtablissement.css')],
	template: require('./filtreSelectionnerTemplateEtablissement.html'),
})
export class FiltreSelectionnerTemplateEtablissement {

	/// variables
		private sub : any;
		private confFiltres: any;
		private paramRequeteFiltre: string = "";
		private filtresAvanceAvecInput: boolean = false;
		private existFilter : boolean = false;
	///

	constructor(private router: Router, private route: ActivatedRoute){
		this.confFiltres = require('../../../../../conf/filtresInsee.json');
	}

	ngOnInit(){
		this.sub = this.route.params.subscribe(params => {
			this.paramRequeteFiltre = this.route.snapshot.parent.params['filtres'];
		});
	}
}