/**
*
* Ce composant permet d'afficher le dashboard Etablissement.
* Il contient pour le moment un composant vide => il pourrait servir pour afficher certaines informations.
* De plus un composant permet d'appeler le composant miniEtabRanker. => Il se trouve dans le composant dashboardInsee.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgGrid, NgGridItem} from 'angular2-grid';

declare var require: any;

@Component({
	selector   : 'dashboardEtablissement',
	styles: [require('./dashboardEtablissement.css')],
	template: require('./dashboardEtablissement.html')
})
export class DashboardEtablissement {
	
	private sub: any;
	private quiQuoi: any;
	private id: any;
	private nameDashboard: any;
	private lock: boolean = false;
	private filtres: any;

	constructor(private route: ActivatedRoute, private router: Router){
		this.sub = this.route.params.subscribe(params => {
			if (params['lockScreen'] == 'false'){
				this.lock = false;
			}
			else {
				this.lock = true;
			}
			this.quiQuoi = params['QuiQuoi'];
			this.id = params['id'];
			this.nameDashboard = params['nameDashboard'];
			this.filtres = params['filtres'];
		});
	}
	ngOnInit(){
	}
}
