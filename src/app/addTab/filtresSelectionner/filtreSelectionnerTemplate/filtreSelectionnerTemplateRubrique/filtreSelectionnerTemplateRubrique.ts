/**
*
* Ce composant permet d'afficher les filtres que l'on à séléctionner Insee.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

declare var require: any;

@Component({
	selector   : 'filtreSelectionnerTemplateRubrique',
	styles: [require('./filtreSelectionnerTemplateRubrique.css')],
	template: require('./filtreSelectionnerTemplateRubrique.html'),
})
export class FiltreSelectionnerTemplateRubrique {

	/// variables
	private sub : any;
	private confFiltres: any;
	private paramRequeteFiltre: string = "";
	///
	private filtresAvanceAvecInput : boolean = false;
	private filtresBasicListeCategorieDeRubriquage : boolean = false;
	private filtresBasicListeNature : boolean = false;
	private existFilter : boolean = false;

	constructor(private router: Router, private route: ActivatedRoute){
		this.confFiltres = require('../../../../../conf/filtresRubrique.json');
	}

	ngOnInit(){
		this.sub = this.route.params.subscribe(params => {
			this.paramRequeteFiltre = this.route.snapshot.parent.params['filtres'];
			this.affecterFiltresSelectionner(this.paramRequeteFiltre);
		});
	}

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
						this.existFilter = true;
						item2.state = true;
						item2.min = item.min;
						item2.max = item.max;
					}
				}
			}
			if (item.champ == "filtresBasicListeCategorieDeRubriquage"){
				for (let item2 of this.confFiltres.filtresBasicListeCategorieDeRubriquage){
					if (item.name == item2.name){
						this.filtresBasicListeCategorieDeRubriquage = true;
						this.existFilter = true;
						item2.state = true;
					}
				}
			}
			if (item.champ == "filtresBasicListeNature"){
				for (let item2 of this.confFiltres.filtresBasicListeNature){
					if (item.name == item2.name){
						this.filtresBasicListeNature = true;
						this.existFilter = true;
						item2.state = true;
					}
				}
			}
		}
	}
}