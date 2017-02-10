/**
*
* Ce composant permet d'afficher les filtres de Insee. L'utilisateur peut ainsi les séléctionner.
* Il seront stocké dans une variable en JSON et dans l'URL.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

declare var require: any;

@Component({
	selector   : 'filtreTemplateEtablissement',
	styles: [require('./filtreTemplateEtablissement.css'), require('../../../../../css/cssGlobal.css')],
	template: require('./filtreTemplateEtablissement.html')
})
export class FiltreTemplateEtablissement {
	/// variables
	private sub : any;
	private confFiltres: any;
	private filtreAvancerActiv : boolean = false;
	private filtreBasicActiv : boolean = true;
	private paramRequeteFiltre: string = "";
	///

	private currentFilter: string = "Choisir un filtre";
	private newFilter: any = [];
	private nbFilter: number = 1;
	private activFiltre: boolean = true;


	/// img
	private flecheHaut: any;
	private flecheBas: any;
	///

	constructor(private router: Router, private route: ActivatedRoute){
		this.confFiltres = require('../../../../../conf/filtresInsee.json');
	}

	ngOnInit(){
		/// image
		this.flecheHaut = require('../../../../../images/flecheHaut.png');
		this.flecheBas = require('../../../../../images/flecheBas.png');
		///
		this.sub = this.route.params.subscribe(params => {
			this.paramRequeteFiltre = this.route.snapshot.parent.params['filtres']; /// vu que l'on est dans le composant enfant on ne peut pas récupérer un paramétre appartenant au composant parent avec la voie normal. Pour ceci on utilise "this.route.snapshot.parent.params['...']".
			this.filtreRoute();
		});
	}

	filtreRoute(){
		(<HTMLInputElement>document.getElementById("radio1")).checked = this.confFiltres.route[0].state;
		(<HTMLInputElement>document.getElementById("radio2")).checked = this.confFiltres.route[1].state;
	}

	changeBase(name, name2){
		if (name == 'Base Insee'){
			this.activFiltre = true;
			this.confFiltres.route[0].state = true;
			this.confFiltres.route[1].state = false;
			(<HTMLInputElement>document.getElementById("radio1")).checked = this.confFiltres.route[0].state;
			(<HTMLInputElement>document.getElementById("radio2")).checked = this.confFiltres.route[1].state;
		}
		else {
			this.activFiltre = false;
			this.confFiltres.route[0].state = false;
			this.confFiltres.route[1].state = true;
			(<HTMLInputElement>document.getElementById("radio1")).checked = this.confFiltres.route[0].state;
			(<HTMLInputElement>document.getElementById("radio2")).checked = this.confFiltres.route[1].state;
		}
	}
}