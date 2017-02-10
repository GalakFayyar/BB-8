/**
*
* Ce composant permet d'appeler un composant fils. => Dashboard.
* C'est le sous-composant en dessous de app.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

declare var require: any;

@Component({
  selector   : 'mainDashboard',
  styles: [require('./mainDashboard.css')],
  template: require('./mainDashboard.html')
})
export class MainDashboard {
	constructor(private route: ActivatedRoute, private router: Router){

	}
}