/**
*
* Ce composant permet d'afficher l'interpretation de la requête avec Delphes.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';

declare var require: any;

@Component({
	selector: 'reponseInterpretationTemplateDelphes',
	styles: [require('./reponseInterpretationTemplateDelphes.css'), require('../../../../../../css/cssGlobal.css')],
	template: require('./reponseInterpretationTemplateDelphes.html')
})
export class ReponseInterpretationTemplateDelphes {
	@Input()
	responseInterpretation: any;
	constructor(){
	}
	ngOnInit(){
	}
}
