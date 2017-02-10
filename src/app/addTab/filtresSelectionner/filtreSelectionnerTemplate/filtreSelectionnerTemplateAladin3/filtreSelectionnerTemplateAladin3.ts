/**
*
* Ce composant permet d'afficher les filtres que l'on à séléctionner Aladin3.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

declare var require: any;

@Component({
	selector   : 'filtreSelectionnerTemplateAladin3',
	styles: [require('./filtreSelectionnerTemplateAladin3.css')],
	template: require('./filtreSelectionnerTemplateAladin3.html'),
})
export class FiltreSelectionnerTemplateAladin3 {

	/// variables
	private sub : any;
	private confFiltres: any;
	private paramRequeteFiltre: string = "";
	///

	constructor(private router: Router, private route: ActivatedRoute){
		this.confFiltres = require('../../../../../conf/filtresAladin3.json');
	}

	ngOnInit(){
		this.sub = this.route.params.subscribe(params => {
			this.paramRequeteFiltre = this.route.snapshot.parent.params['filtres'];
			this.affecterFiltresSelectionner(this.paramRequeteFiltre);
		});
	}

	private filtresAvanceAvecInput : boolean = false;
	private filtresAvanceAvecInput2 : boolean = false;
	private filtresAvanceTypeDernierEvenement : boolean = false;
	private filtresAvanceDernierUtilisateurEvenement : boolean = false;
	private filtresTypologie : boolean = false;
	private filtresBasicTypeDernierEvenement : boolean = false;
	private filtresBasicDernierUtilisateurEvenement : boolean = false;
	private filtresBasicDernierUtilisateurAffectations : boolean = false;
	private filtresBasicStatuts : boolean = false;
	private existFilter : boolean = false;

	affecterFiltresSelectionner(filtre){
		var paramRequeteFiltre : any = [];
		if (filtre == undefined){
			return 1;
		}
		if (filtre == "undefined"){
			return 1;
		}

		paramRequeteFiltre = JSON.parse(filtre);
		for (let item of paramRequeteFiltre){
			if (item.champ == "filtresAvanceAvecInput"){
				for (let item2 of this.confFiltres.filtresAvanceAvecInput){
					if ("filtre_numerique_" + item.name == "filtre_numerique_" + item2.name){
						this.filtresAvanceAvecInput = true;
						item2.state = true;
						this.existFilter = true;
						item2.min = item.min;
						item2.max = item.max;
					}
				}
			}
			if (item.champ == "filtresAvanceAvecInput2"){
				for (let item2 of this.confFiltres.filtresAvanceAvecInput2){
					if ("filtre_numerique_" + item.name == "filtre_numerique_" + item2.name){
						this.filtresAvanceAvecInput2 = true;
						item2.state = true;
						this.existFilter = true;
						item2.min = item.min;
						item2.max = item.max;
					}
				}
			}
			if (item.champ == "filtresAvanceTypeDernierEvenement"){
				for (let item2 of this.confFiltres.filtresAvanceTypeDernierEvenement){
					if (item.name == item2.name){
						this.filtresAvanceTypeDernierEvenement = true;
						this.existFilter = true;
						item2.state = true;
					}
				}
			}
			if (item.champ == "filtresAvanceDernierUtilisateurEvenement"){
				for (let item2 of this.confFiltres.filtresAvanceDernierUtilisateurEvenement){
					if (item.name == item2.name){
						this.filtresAvanceDernierUtilisateurEvenement = true;
						this.existFilter = true;
						item2.state = true;
					}
				}
			}
			if (item.champ == "typologie"){
				for (let item2 of this.confFiltres.typologie){
					if (item.name == item2.name){
						this.filtresTypologie = true;
						this.existFilter = true;
						item2.state = true;
					}
				}
			}
			if (item.champ == "filtresBasicTypeDernierEvenement"){
				for (let item2 of this.confFiltres.filtresBasicTypeDernierEvenement){
					if (item.name == item2.name){
						this.filtresBasicTypeDernierEvenement = true;
						this.existFilter = true;
						item2.state = true;
					}
				}
			}
			if (item.champ == "filtresBasicDernierUtilisateurEvenement"){
				for (let item2 of this.confFiltres.filtresBasicDernierUtilisateurEvenement){
					if (item.name == item2.name){
						this.filtresBasicDernierUtilisateurEvenement = true;
						this.existFilter = true;
						item2.state = true;
					}
				}
			}
			if (item.champ == "filtresBasicDernierUtilisateurAffectations"){
				for (let item2 of this.confFiltres.filtresBasicDernierUtilisateurAffectations){
					if (item.name == item2.name){
						this.filtresBasicDernierUtilisateurAffectations = true;
						this.existFilter = true;
						item2.state = true;
					}
				}
			}
			if (item.champ == "filtresBasicStatuts"){
				for (let item2 of this.confFiltres.filtresBasicStatuts){
					if (item.name == item2.name){
						this.filtresBasicStatuts = true;
						this.existFilter = true;
						item2.state = true;
					}
				}
			}
		}
	}
}