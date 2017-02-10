/**
*
* Ce composant permet d'afficher les filtres de aladin3. L'utilisateur peut ainsi les séléctionner.
* Il seront stocké dans une variable en JSON et dans l'URL.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {SelectModule} from 'angular2-select';

// import { DatepickerModule } from 'ng2-bootstrap/ng2-bootstrap';
import * as moment from 'moment';

declare var require: any;

@Component({
	selector : 'filtreTemplateAladin3',
	styles: [require('./filtreTemplateAladin3.css'), require('../../../../../css/cssGlobal.css')],
	template: require('./filtreTemplateAladin3.html')
})
export class FiltreTemplateAladin3 {

	
	/// variables
	public dtMin: Date = new Date();
	public dtMax: Date = new Date();
	private sub : any;
	private confFiltresAladin3: any;
	private filtreAvancerActiv : boolean = false;
	private filtreBasicActiv : boolean = true;
	private paramRequeteFiltre: string = "";
	private dateMinActiv: boolean = false;
	private dateMaxActiv: boolean = false;
	///

	private tabFiltresAvanceDernierUtilisateurEvenement: any = [];
	private tabFiltresBasicDernierUtilisateurEvenement: any = [];
	private tabFiltresBasicDernierUtilisateurAffectations: any = [];
	private tabFiltresAvanceTypeDernierEvenement: any = [];
	private tabFiltresBasicStatuts: any = [];
	private tabFiltresBasicTypeDernierEvenement: any = [];
	private tabTypologie: any = [];

	private currentFilter: string = "Choisir un filtre";
	private newFilter: any = [];
	private nbFilter: number = 1;

	private currentFilter2: string = "Choisir un filtre";
	private newFilter2: any = [];
	private nbFilter2: number = 1;

	private ngModelTabFiltresAvanceTypeDernierEvenement: any = [];
	private ngModelTabFiltresAvanceDernierUtilisateurEvenement: any = [];
	private ngModelTabFiltresBasicDernierUtilisateurEvenement: any = [];
	private ngModelTabFiltresBasicTypeDernierEvenement: any = [];
	private ngModelTabFiltresBasicDernierUtilisateurAffectations: any = [];
	private ngModelTabFiltresBasicStatuts: any = [];
	private ngModelTabTypologie: any = [];

	/// img
	private flecheHaut: any;
	private flecheBas: any;
	///

	constructor(private router: Router, private route: ActivatedRoute){
		this.confFiltresAladin3 = require('../../../../../conf/filtresAladin3.json');
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
		this.affecterFiltresSelectionner(this.paramRequeteFiltre); /// Attendre 1ms. sinon les inputs ne sont pas charger et il y a donc pas de id.
		this.makeTabForFiltres();
	}

	filtreAvancer(){
		this.filtreAvancerActiv = false;
		this.filtreBasicActiv = true;
	}

	filtreBasic(){
		this.filtreAvancerActiv = true;
		this.filtreBasicActiv = false;
	}

	clickedOnFiltre(obj, bool){
		obj.state = bool;
	}

	
	makeTabForFiltres(){
		for (let item of this.confFiltresAladin3.filtresAvanceDernierUtilisateurEvenement){
			this.tabFiltresAvanceDernierUtilisateurEvenement.push({"label": item.name, "value": item.name});
		}
		for (let item of this.confFiltresAladin3.filtresBasicDernierUtilisateurEvenement){
			this.tabFiltresBasicDernierUtilisateurEvenement.push({"label": item.name, "value": item.name});
		}
		for (let item of this.confFiltresAladin3.filtresBasicDernierUtilisateurAffectations){
			this.tabFiltresBasicDernierUtilisateurAffectations.push({"label": item.name, "value": item.name});
		}
		for (let item of this.confFiltresAladin3.filtresAvanceTypeDernierEvenement){
			this.tabFiltresAvanceTypeDernierEvenement.push({"label": item.name, "value": item.name});
		}
		for (let item of this.confFiltresAladin3.filtresBasicStatuts){
			this.tabFiltresBasicStatuts.push({"label": item.name, "value": item.name});
		}
		for (let item of this.confFiltresAladin3.filtresBasicTypeDernierEvenement){
			this.tabFiltresBasicTypeDernierEvenement.push({"label": item.name, "value": item.name});
		}
		for (let item of this.confFiltresAladin3.typologie){
			this.tabTypologie.push({"label": item.name, "value": item.name});
		}
	}

	onSelectedUtiliteur(item, filtre) {
		// let confFiltres : string;
		// confFiltres = "this.confFiltresAladin3.";
		// confFiltres += filtre;
		// for (let conf of eval(confFiltres)){
		// 	if (conf.name == item.label){
		// 		conf.state = true;
		// 	}
		// }

		for (let conf of this.confFiltresAladin3[filtre]){
			if (conf.name == item.label){
				conf.state = true;
			}
		}
	}

	onDeselectedUtilisateur(item, filtre) {
	    // let confFiltres : string;
		// confFiltres = "this.confFiltresAladin3.";
		// confFiltres += filtre;
		// for (let conf of eval(confFiltres)){
		// 	if (conf.name == item.label){
		// 		conf.state = false;
		// 	}
		// }
		for (let conf of this.confFiltresAladin3[filtre]){
			if (conf.name == item.label){
				conf.state = false;
			}
		}
	}

	chooseFilterNumeriques(name, filtreName){
		this.currentFilter = name;
		for (let item of this.newFilter){
			if (item.name == filtreName){
				item.currentFilter = name;
			}
		}
	}

	addFilterNumeriques(){
		this.nbFilter += 1;
		this.newFilter.push({"name": 'newFilter' + this.nbFilter, "currentFilter": 'Choisir un filtre', "min": "undefined", "max": "undefined"});
	}

	desaffecterFilterNumeriques(currentFilter){
		var cpt: number = 0;
		(<HTMLInputElement>document.getElementById("filtre_numerique_min" + currentFilter)).value = "";
		(<HTMLInputElement>document.getElementById("filtre_numerique_max" + currentFilter)).value = "";
		for (let item of this.confFiltresAladin3.filtresAvanceAvecInput){
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

	chooseFilterTaux(name, filtreName){
		this.currentFilter2 = name;
		for (let item of this.newFilter2){
			if (item.name == filtreName){
				item.currentFilter = name;
			}
		}
	}

	addFilterTaux(){
		this.nbFilter2 += 1;
		this.newFilter2.push({"name": 'newFilter2' + this.nbFilter2, "currentFilter": 'Choisir un filtre', "min": "undefined", "max": "undefined"});
	}

	// removeFilter2(){
	// 	this.nbFilter2 -= 1;
	// 	this.newFilter2.pop();
	// }

	// affecterFilterTaux(currentFilter){
	// 	for (let item of this.newFilter2){
	// 		if (item.currentFilter == currentFilter){
	// 			item.min = (<HTMLInputElement>document.getElementById("filtre_numerique_min" + item.currentFilter)).value;
	//			item.max = (<HTMLInputElement>document.getElementById("filtre_numerique_max" + item.currentFilter)).value;
	// 			for (let item2 of this.confFiltresAladin3.filtresAvanceAvecInput2){
	// 				if (item2.name == currentFilter){
	//					item2.state = true;
	// 					item2.min = item.min;
	// 					item2.max = item.max;
	// 				}
	// 			}
	// 		}
	// 	}
	// }

	desaffecterFilterTaux(currentFilter){
		var cpt: number = 0;
		(<HTMLInputElement>document.getElementById("filtre_numerique_min" + currentFilter)).value = "";
		(<HTMLInputElement>document.getElementById("filtre_numerique_max" + currentFilter)).value = "";
		for (let item of this.confFiltresAladin3.filtresAvanceAvecInput2){
			if (item.name == currentFilter){
				item.state = false;
			}
		}
		for (let item of this.newFilter2){
			if (item.currentFilter == currentFilter){
				this.newFilter2.splice(cpt, 1);
			}
			cpt += 1;
		}
		this.nbFilter2 -= 1;
	}

	getItemByName (item, val) {
		return item.name === val;
	}

	affecterFiltresSelectionner(filtre){
		/*
		* Cette méthode permet s'il y a des filtres déjà séléctionner de les remetre en place au niveau template. Puisque en changeant de routes il peuvent sénlever.
		*/

		var cpt : number = 1;
		var cpt2 : number = 1;
		var paramRequeteFiltre : any = [];
		if (filtre == undefined){ // pour mettre 1 champ de séléction pour ne pas appuyer sur + la première fois
			this.newFilter = [{"name": 'newFilter' + 0, "currentFilter": 'Choisir un filtre', "min": "undefined", "max": "undefined"}];
			this.newFilter2 = [{"name": 'newFilter2' + 0, "currentFilter": 'Choisir un filtre', "min": "undefined", "max": "undefined"}];
			return 1;
		}
		if (filtre == "undefined"){
			this.newFilter = [{"name": 'newFilter' + 0, "currentFilter": 'Choisir un filtre', "min": "undefined", "max": "undefined"}];
			this.newFilter2 = [{"name": 'newFilter2' + 0, "currentFilter": 'Choisir un filtre', "min": "undefined", "max": "undefined"}];
			return 1;
		}
		paramRequeteFiltre = JSON.parse(filtre);
		for (let item of paramRequeteFiltre){
			if (item.champ == "filtresAvanceAvecInput"){
				this.newFilter.push({"name": 'newFilter' + cpt, "currentFilter": item.name, "min": item.min, "max": item.max});
				cpt += 1;
			}
			if (item.champ == "filtresAvanceAvecInput2"){
				this.newFilter2.push({"name": 'newFilter2' + cpt2, "currentFilter": item.name, "min": item.min, "max": item.max});
				cpt2 += 1;
			}
			if (item.champ == "filtresAvanceTypeDernierEvenement"){
				let _eltFiltre = this.confFiltresAladin3.filtresAvanceTypeDernierEvenement.find(function (elt) { return elt.name === item.name; });
				if (_eltFiltre != undefined) {
					this.ngModelTabFiltresAvanceTypeDernierEvenement.push(_eltFiltre.name);
				} else {
					console.log("[ERROR] : Anomalie de récupération des filtres : le filtre " + item.champ + " n'existe pas dans la configuration.");
				}

				// for (let item2 of this.confFiltresAladin3.filtresAvanceTypeDernierEvenement){
				// 	if (item.name == item2.name){
				// 		this.ngModelTabFiltresAvanceTypeDernierEvenement.push(item.name);
				// 	}
				// }
			}
			if (item.champ == "filtresAvanceDernierUtilisateurEvenement"){
				let _eltFiltre = this.confFiltresAladin3.filtresAvanceDernierUtilisateurEvenement.find(function (elt) { return elt.name === item.name; });
				if (_eltFiltre != undefined) {
					this.ngModelTabFiltresAvanceDernierUtilisateurEvenement.push(_eltFiltre.name);
				} else {
					console.log("[ERROR] : Anomalie de récupération des filtres : le filtre " + item.champ + " n'existe pas dans la configuration.");
				}

				// for (let item2 of this.confFiltresAladin3.filtresAvanceDernierUtilisateurEvenement){
				// 	if (item.name == item2.name){
				// 		this.ngModelTabFiltresAvanceDernierUtilisateurEvenement.push(item.name);
				// 	}
				// }
			}
			if (item.champ == "filtresBasicDernierUtilisateurEvenement"){
				let _eltFiltre = this.confFiltresAladin3.filtresBasicDernierUtilisateurEvenement.find(function (elt) { return elt.name === item.name; });
				if (_eltFiltre != undefined) {
					this.ngModelTabFiltresBasicDernierUtilisateurEvenement.push(_eltFiltre.name);
				} else {
					console.log("[ERROR] : Anomalie de récupération des filtres : le filtre " + item.champ + " n'existe pas dans la configuration.");
				}

				// for (let item2 of this.confFiltresAladin3.filtresBasicDernierUtilisateurEvenement){
				// 	if (item.name == item2.name){
				// 		this.ngModelTabFiltresBasicDernierUtilisateurEvenement.push(item.name);
				// 	}
				// }
			}
			if (item.champ == "filtresBasicTypeDernierEvenement"){
				let _eltFiltre = this.confFiltresAladin3.filtresBasicTypeDernierEvenement.find(function (elt) { return elt.name === item.name; });
				if (_eltFiltre != undefined) {
					this.ngModelTabFiltresBasicTypeDernierEvenement.push(_eltFiltre.name);
				} else {
					console.log("[ERROR] : Anomalie de récupération des filtres : le filtre " + item.champ + " n'existe pas dans la configuration.");
				}

				// for (let item2 of this.confFiltresAladin3.filtresBasicTypeDernierEvenement){
				// 	if (item.name == item2.name){
				// 		this.ngModelTabFiltresBasicTypeDernierEvenement.push(item.name);
				// 	}
				// }
			}
			if (item.champ == "filtresBasicDernierUtilisateurAffectations"){
				let _eltFiltre = this.confFiltresAladin3.filtresBasicDernierUtilisateurAffectations.find(function (elt) { return elt.name === item.name; });
				if (_eltFiltre != undefined) {
					this.ngModelTabFiltresBasicDernierUtilisateurAffectations.push(_eltFiltre.name);
				} else {
					console.log("[ERROR] : Anomalie de récupération des filtres : le filtre " + item.champ + " n'existe pas dans la configuration.");
				}

				// for (let item2 of this.confFiltresAladin3.filtresBasicDernierUtilisateurAffectations){
				// 	if (item.name == item2.name){
				// 		this.ngModelTabFiltresBasicDernierUtilisateurAffectations.push(item.name);
				// 	}
				// }
			}
			if (item.champ == "filtresBasicStatuts"){
				let _eltFiltre = this.confFiltresAladin3.filtresBasicStatuts.find(function (elt) { return elt.name === item.name; });
				if (_eltFiltre != undefined) {
					this.ngModelTabFiltresBasicStatuts.push(_eltFiltre.name);
				} else {
					console.log("[ERROR] : Anomalie de récupération des filtres : le filtre " + item.champ + " n'existe pas dans la configuration.");
				}

				// for (let item2 of this.confFiltresAladin3.filtresBasicStatuts){
				// 	if (item.name == item2.name){
				// 		this.ngModelTabFiltresBasicStatuts.push(item.name);
				// 	}
				// }
			}
			if (item.champ == "typologie"){
				let _eltFiltre = this.confFiltresAladin3.typologie.find(function (elt) { return elt.name === item.name; });
				if (_eltFiltre != undefined) {
					this.ngModelTabTypologie.push(_eltFiltre.name);
				} else {
					console.log("[ERROR] : Anomalie de récupération des filtres : le filtre " + item.champ + " n'existe pas dans la configuration.");
				}

				// for (let item2 of this.confFiltresAladin3.typologie){
				// 	if (item.name == item2.name){
				// 		this.ngModelTabTypologie.push(item.name);
				// 	}
				// }
			}
		}
		if (cpt == 1){
			this.newFilter = [{"name": 'newFilter' + 0, "currentFilter": 'Choisir un filtre', "min": "undefined", "max": "undefined"}];
		}
		if (cpt2 == 1){
			this.newFilter2 = [{"name": 'newFilter2' + 0, "currentFilter": 'Choisir un filtre', "min": "undefined", "max": "undefined"}];
		}
	}

	filtreRoute(){
		(<HTMLInputElement>document.getElementById("radio1")).checked = this.confFiltresAladin3.route[0].state;
		(<HTMLInputElement>document.getElementById("radio2")).checked = this.confFiltresAladin3.route[1].state;
		(<HTMLInputElement>document.getElementById("radio3")).checked = this.confFiltresAladin3.route[2].state;
		(<HTMLInputElement>document.getElementById("radio4")).checked = this.confFiltresAladin3.route[3].state;
		(<HTMLInputElement>document.getElementById("radio5")).checked = this.confFiltresAladin3.route[4].state;
		(<HTMLInputElement>document.getElementById("radio6")).checked = this.confFiltresAladin3.route[5].state;
	}

	radioInput(name, name2){
		for (let item of this.confFiltresAladin3.route){
			if (item.name == name){
				item.state = true;
			}
			if (item.name == name2){
				item.state = false;
			}
		}

		this.confFiltresAladin3.route[6].indexElastic = "/aladin3";
		this.confFiltresAladin3.route[6].idSousRubrique = "Données30jourscourant";
		this.confFiltresAladin3.route[6].nameSousRubrique = "Données 30 jours courant";
		this.confFiltresAladin3.route[6].nameRubriquesElasticSearch = "Donnéesfixes";

		if (name == "Données mobiles"){
			this.confFiltresAladin3.route[6].indexElastic = "/donneesmobiles3";
			this.confFiltresAladin3.route[6].idSousRubrique = "Donnéesmobiles30jourscourant";
			this.confFiltresAladin3.route[6].nameSousRubrique = "Données mobiles 30 jours courant";
			this.confFiltresAladin3.route[6].nameRubriquesElasticSearch = "Donnéesmobiles";
		}
		if (name == "30Jours"){
			this.confFiltresAladin3.route[6].idSousRubrique = this.confFiltresAladin3.route[6].idSousRubrique.replace("150", "30");
			this.confFiltresAladin3.route[6].nameSousRubrique = this.confFiltresAladin3.route[6].nameSousRubrique.replace("150", "30");
		}
		if (name == "150Jours"){
			this.confFiltresAladin3.route[6].idSousRubrique = this.confFiltresAladin3.route[6].idSousRubrique.replace("30", "150");
			this.confFiltresAladin3.route[6].nameSousRubrique = this.confFiltresAladin3.route[6].nameSousRubrique.replace("30", "150");
		}
		if (name == "Jours courant"){
			this.confFiltresAladin3.route[6].idSousRubrique = this.confFiltresAladin3.route[6].idSousRubrique.replace("précédent", "courant");
			this.confFiltresAladin3.route[6].nameSousRubrique = this.confFiltresAladin3.route[6].nameSousRubrique.replace("précédent", "courant");
		}
		if (name == "Jours précedent"){
			this.confFiltresAladin3.route[6].idSousRubrique = this.confFiltresAladin3.route[6].idSousRubrique.replace("courant", "précédent");
			this.confFiltresAladin3.route[6].nameSousRubrique = this.confFiltresAladin3.route[6].nameSousRubrique.replace("courant", "précédent");
		}
	}

	public getDateMin():number {
		return this.dtMin && this.dtMin.getTime() || new Date().getTime();
	}

	public getDateMax():number {
		return this.dtMax && this.dtMax.getTime() || new Date().getTime();
	}

	dateMin(){
		if (this.dateMinActiv == true){
			this.dateMinActiv = false;
			for (let conf of this.confFiltresAladin3.date){
				if (conf.name == "Date dernier événement"){
					conf.state = true;
					conf.valueMin = this.dtMin.toISOString().replace('23:00:00.000Z', '00:00:00');
				}
			}
		}
		else {
			this.dateMinActiv = true;
		}
	}
	
	dateMax(){
		if (this.dateMaxActiv == true){
			this.dateMaxActiv = false;
			for (let conf of this.confFiltresAladin3.date){
				if (conf.name == "Date dernier événement"){
					conf.state = true;
					conf.valueMax = this.dtMax.toISOString().replace('23:00:00.000Z', '23:59:59');
				}
			}
		}
		else {
			this.dateMaxActiv = true;
		}
	}
}