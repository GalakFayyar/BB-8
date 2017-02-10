/**
*
* Ce composant permet d'afficher l'interpretation de la requête avec l'API Interpretation.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

declare var require: any;

@Component({
	selector: 'reponseInterpretationTemplateApiInterpretation',
	styles: [require('./reponseInterpretationTemplateApiInterpretation.css'), require('../../../../../../css/cssGlobal.css')],
	template: require('./reponseInterpretationTemplateApiInterpretation.html')
})
export class ReponseInterpretationTemplateApiInterpretation {
	@Input()
	responseInterpretation: any;

	constructor(private route: ActivatedRoute, private router: Router){
	}
	
	ngOnInit(){
	}

		goToRubrique(query, libelle){
		let link = ['/mainDashboard/dashboard',
			libelle,
			query,
			'rubrique',
			false,
			"[]"
		];
		this.router.navigate(link);
    }
}
