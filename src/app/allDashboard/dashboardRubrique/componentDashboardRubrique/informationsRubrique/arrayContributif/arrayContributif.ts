/**
*
* Ce sous-composant affiche les informations contributif.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';

declare var require: any;

@Component({
	selector   : 'arrayContributif',
	styles: [require('./arrayContributif.css')],
	template: require('./arrayContributif.html')
})
export class ArrayContributif {
	@Input()
	responseRubrique: any;

	constructor(){

	}
	ngOnInit(){
	}
}
