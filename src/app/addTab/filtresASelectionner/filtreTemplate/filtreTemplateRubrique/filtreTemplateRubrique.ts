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
import {SelectModule} from 'angular2-select';

declare var require: any;

@Component({
	selector   : 'filtreTemplateRubrique',
	styles: [require('./filtreTemplateRubrique.css'), require('../../../../../css/cssGlobal.css')],
	template: require('./filtreTemplateRubrique.html')
})
export class FiltreTemplateRubrique {
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

	private tabFiltresBasicListeCategorieDeRubriquage: any = [];
	private tabFiltresBasicListeNature: any = [];
	
	private ngModelTabFiltresBasicListeCategorieDeRubriquage: any = [];
	private ngModelTabFiltresBasicListeNature: any = [];
	
	/// img
	private flecheHaut: any;
	private flecheBas: any;
	///

	constructor(private router: Router, private route: ActivatedRoute){
		this.confFiltres = require('../../../../../conf/filtresRubrique.json');
	}

	ngOnInit(){
		/// image
		this.flecheHaut = require('../../../../../images/flecheHaut.png');
		this.flecheBas = require('../../../../../images/flecheBas.png');
		///
		this.sub = this.route.params.subscribe(params => {
			this.paramRequeteFiltre = this.route.snapshot.parent.params['filtres']; /// vu que l'on est dans le composant enfant on ne peut pas récupérer un paramétre appartenant au composant parent avec la voie normal. Pour ceci on utilise "this.route.snapshot.parent.params['...']".
		});
		this.affecterFiltresSelectionner(this.paramRequeteFiltre); /// Attendre 1ms. sinon les inputs ne sont pas charger et il y a donc pas de id.
		this.makeTabForFiltres();
	}

	clickedOnFiltre(obj, bool){
		obj.state = bool;
	}


	affecterFiltresSelectionner(filtre){
		/*
		* Cette méthode permet s'il y a des filtres déjà séléctionner de les remetres en place au niveau template. Puisque en changeant de routes il peuvent sénlever.
		*/
		var cpt : number = 1;
		var paramRequeteFiltre : any = [];
		if (filtre == undefined){
			this.newFilter = [{"name": 'newFilter' + 0, "currentFilter": 'Choisir un filtre', "min": "undefined", "max": "undefined"}];
			return 1;
		}
		if (filtre == "undefined"){
			this.newFilter = [{"name": 'newFilter' + 0, "currentFilter": 'Choisir un filtre', "min": "undefined", "max": "undefined"}];
			return 1;
		}
		paramRequeteFiltre = JSON.parse(filtre);
		for (let item of paramRequeteFiltre){
			if (item.champ == "filtresAvanceAvecInput"){
				this.newFilter.push({"name": 'newFilter' + cpt, "currentFilter": item.name, "min": item.min, "max": item.max});
				cpt += 1;
			}
			if (item.champ == "filtresBasicListeCategorieDeRubriquage"){
				let _eltFiltre = this.confFiltres.filtresBasicListeCategorieDeRubriquage.find(function (elt) { return elt.name === item.name; });
				if (_eltFiltre != undefined) {
					this.ngModelTabFiltresBasicListeCategorieDeRubriquage.push(_eltFiltre.name);
				} else {
					console.log("[ERROR] : Anomalie de récupération des filtres : le filtre " + item.champ + " n'existe pas dans la configuration.");
				}

				// for (let item2 of this.confFiltres.filtresBasicListeCategorieDeRubriquage){
				// 	if (item.name == item2.name){
				// 		this.ngModelTabFiltresBasicListeCategorieDeRubriquage.push(item.name);
				// 	}
				// }
			}
			if (item.champ == "filtresBasicListeNature"){
				let _eltFiltre = this.confFiltres.filtresBasicListeNature.find(function (elt) { return elt.name === item.name; });
				if (_eltFiltre != undefined) {
					this.ngModelTabFiltresBasicListeNature.push(_eltFiltre.name);
				} else {
					console.log("[ERROR] : Anomalie de récupération des filtres : le filtre " + item.champ + " n'existe pas dans la configuration.");
				}

				// for (let item2 of this.confFiltres.filtresBasicListeNature){
				// 	if (item.name == item2.name){
				// 		this.ngModelTabFiltresBasicListeNature.push(item.name);
				// 	}
				// }
			}
		}
		if (cpt == 1){
			this.newFilter = [{"name": 'newFilter' + 0, "currentFilter": 'Choisir un filtre', "min": "undefined", "max": "undefined"}];
		}
	}

	makeTabForFiltres(){
		for (let item of this.confFiltres.filtresBasicListeCategorieDeRubriquage){
			this.tabFiltresBasicListeCategorieDeRubriquage.push({"label": item.name, "value": item.name});
		}
		for (let item of this.confFiltres.filtresBasicListeNature){
			this.tabFiltresBasicListeNature.push({"label": item.name, "value": item.name});
		}
	}

	onSelectedUtiliteur(item, filtre) {
		// let confFiltres : string;
		// confFiltres = "this.confFiltres.";
		// confFiltres += filtre;
		// for (let conf of eval(confFiltres)){
		// 	if (conf.name == item.label){
		// 		conf.state = true;
		// 	}
		// }
		for (let conf of this.confFiltres[filtre]){
			if (conf.name == item.label){
				conf.state = true;
			}
		}
	}

	onDeselectedUtilisateur(item, filtre) {
	 //    let confFiltres : string;
		// confFiltres = "this.confFiltres.";
		// confFiltres += filtre;
		// for (let conf of eval(confFiltres)){
		// 	if (conf.name == item.label){
		// 		conf.state = false;
		// 	}
		// }
		for (let conf of this.confFiltres[filtre]){
			if (conf.name == item.label){
				conf.state = false;
			}
		}
	}

	chooseFilter(name, filtreName){
		this.currentFilter = name;
		for (let item of this.newFilter){
			if (item.name == filtreName){
				item.currentFilter = name;
			}
		}
	}

	addFilter(){
		this.nbFilter += 1;
		this.newFilter.push({"name": 'newFilter' + this.nbFilter, "currentFilter": 'Choisir un filtre', "min": "undefined", "max": "undefined"});
	}

	desaffecterFilter(currentFilter){
		var cpt: number = 0;
		(<HTMLInputElement>document.getElementById("filtre_numerique_min" + currentFilter)).value = "";
		(<HTMLInputElement>document.getElementById("filtre_numerique_max" + currentFilter)).value = "";
		for (let item of this.confFiltres.filtresAvanceAvecInput){
			if (item.name == currentFilter){
				item.state = false;
			}
		}
		for (let item of this.newFilter){
			if (item.currentFilter == currentFilter){
				this.newFilter.splice(cpt, 1);
			}
			cpt += 1;
		}
		this.nbFilter -= 1;
	}
}