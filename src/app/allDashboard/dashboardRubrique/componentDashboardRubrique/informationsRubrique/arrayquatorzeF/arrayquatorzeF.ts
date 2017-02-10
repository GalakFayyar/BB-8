/**
*
* Ce sous-composant affiche les informations 14F
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';

declare var require: any;

@Component({
	selector   : 'arrayquatorzeF',
	styles: [require('./arrayquatorzeF.css')],
	template: require('./arrayquatorzeF.html')
})
export class ArrayquatorzeF {
	@Input()
	responseRubrique: any;

	constructor(){

	}
	ngOnInit(){
	}
}
