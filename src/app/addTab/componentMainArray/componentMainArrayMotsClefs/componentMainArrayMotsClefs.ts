/**
*
* Ce composant permet d'afficher le tableau pour les données de mots clefs.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';

declare var require: any;

@Component({
	selector   : 'componentMainArrayMotsClefs',
	styles: [require('./componentMainArrayMotsClefs.css'), require('../../../../css/cssGlobal.css'), require('../tabCss.css')],
	template: require('./componentMainArrayMotsClefs.html')
})
export class ComponentMainArrayMotsClefs {
	@Input()
	varRequeteOnInput: any;
}