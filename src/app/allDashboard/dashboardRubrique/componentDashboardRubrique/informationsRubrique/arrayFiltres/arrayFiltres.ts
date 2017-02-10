/**
*
* Ce sous-composant affiche les informations filtres. 
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';

declare var require: any;

@Component({
	selector   : 'arrayFiltres',
	styles: [require('./arrayFiltres.css')],
	template: require('./arrayFiltres.html')
})
export class ArrayFiltres {
	@Input()
	responseRubrique: any;

	constructor(){

	}
	ngOnInit(){
	}
}
