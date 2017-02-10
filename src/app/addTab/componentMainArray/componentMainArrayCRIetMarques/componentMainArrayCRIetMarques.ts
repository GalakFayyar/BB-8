/**
*
* Ce composant permet d'afficher le tableau pour les données CRI et Marques.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';

declare var require: any;

@Component({
	selector   : 'componentMainArrayCRIetMarques',
	styles: [require('./componentMainArrayCRIetMarques.css'), require('../../../../css/cssGlobal.css'), require('../tabCss.css')],
	template: require('./componentMainArrayCRIetMarques.html')
})
export class ComponentMainArrayCRIetMarques {
	@Input()
	varRequeteOnInput: any;
}