/**
*
* Ce composant permet d'afficher le dashboard Aladin3 (voir le fichier .html).
* Il va appeler ces sous-composants qui chacun d'eux vont constitué un module. => Les sous-composants sont stocké dans le dossier componentDashboardAladin3.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgGrid, NgGridItem} from 'angular2-grid';
import {Cookie} from 'ng2-cookies/ng2-cookies';

import myGlobals = require('../../../globals');

declare var require: any;

@Component({
	selector   : 'dashboardAladin3',
	styles: [require('./dashboardAladin3.css'), require('../../../css/cssGlobal.css')],
	template: require('./dashboardAladin3.html')
})
export class DashboardAladin3 {

	private sub: any;
	private connect : boolean = false;
	private tabDisplayComposants: any = []; /// tableau pour savoir quel composant à afficher celui-ci est stocké dans un cookies
	private lock: boolean = false; // verouiller le deplacement des composants

	constructor(private route: ActivatedRoute, private router: Router){

	}

	ngOnInit(){
		this.connect = myGlobals.connect;
		if (Cookie.get('tabDisplayComposantsAladin3') != null){
			let cookies = Cookie.get('tabDisplayComposantsAladin3');
			this.tabDisplayComposants = JSON.parse(cookies);
		}
		else {
			this.tabDisplayComposants = [
				{"name": 'Interpretation', "state": true},
				{"name": 'Stats recherches utilisateurs', "state": true},
				{"name": 'Stats', "state": true},
				{"name": 'GeoRequetes', "state": true},
				{"name": 'Actions', "state": true}
			];
		}
		let tabDisplayComposantsString = JSON.stringify(this.tabDisplayComposants);
		Cookie.set('tabDisplayComposantsAladin3', tabDisplayComposantsString, 5);
		/// recup la variable lock pour savoir si l'on peut bouger les composants ou non
		this.sub = this.route.params.subscribe(params => {
			if (params['lockScreen'] == 'false'){
				this.lock = false;
			}
			else {
				this.lock = true;
			}
		});
	}

	modifStateComposants(name){
		for (let item of this.tabDisplayComposants){
			if (item.name == name){
				(item.state == true) ? (item.state = false) : (item.state = true);
			}
		}
		let tabDisplayComposantsString = JSON.stringify(this.tabDisplayComposants);
		Cookie.set('tabDisplayComposantsAladin3', tabDisplayComposantsString, 5);
	}

	modifStateAllComposantsActiv(){
		/// Désactivation de toutes les colonnes.
		for (let item of this.tabDisplayComposants){
			item.state = true;
		}
		let tabDisplayComposantsString = JSON.stringify(this.tabDisplayComposants);
		Cookie.set('tabDisplayComposantsAladin3', tabDisplayComposantsString, 5);
	}

	modifStateAllComposantsNone(){
		for (let item of this.tabDisplayComposants){
			item.state = false;
		}
		let tabDisplayComposantsString = JSON.stringify(this.tabDisplayComposants);
		Cookie.set('tabDisplayComposantsAladin3', tabDisplayComposantsString, 5);
	}
}
