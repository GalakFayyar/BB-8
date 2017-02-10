/**
*
* Ce composant permet d'afficher le dashboard Insee.
* Il contient un sous-composant vide qui permettera d'afficher des informations insee.
* Et aussi un sous-composant miniEtabRanker qui affiche une sorte de widget de l'EtabRanker.
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
	selector   : 'dashboardInsee',
	styles: [require('./dashboardInsee.css')],
	template: require('./dashboardInsee.html')
})
export class DashboardInsee {
	
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
