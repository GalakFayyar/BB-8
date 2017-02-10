/**
*
* Ce composant permet d'afficher l'interpretation de la requête avec WSActivité.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';

declare var require: any;

@Component({
	selector: 'reponseInterpretationTemplateWsActivite',
	styles: [require('./reponseInterpretationTemplateWsActivite.css'), require('../../../../../../css/cssGlobal.css')],
	template: require('./reponseInterpretationTemplateWsActivite.html')
})
export class ReponseInterpretationTemplateWsActivite {
	@Input()
	responseInterpretation: any;
	constructor(){
	}
	ngOnInit(){
	}
}
