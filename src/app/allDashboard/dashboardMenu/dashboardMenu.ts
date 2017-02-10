/**
*
* Ce composant permet d'afficher le menu. Chaque module du menu est enregistrer dans un fichier conf.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RequetePageListService} from '../../../service/requeteService';
import {Cookie} from 'ng2-cookies/ng2-cookies';

declare var require: any;

@Component({
	selector: 'dashboardMenu',
	styles: [require('./dashboardMenu.css')],
	template: require('./dashboardMenu.html')
})
export class DashboardMenu {

	private windowHeight: boolean = true; // true=agrandir le box-footer 
	private nameOfRubrique: string;

	private champCibleSelectionner : any;
	private indexForRequete : any;
	private currentIndexElasticSearch : any;
	private idSousRubrique : any;
	private nameSousRubrique : any;
	private nameRubriquesElasticSearch : any;

	private confMenu: any; /// contient la configuration du menu qui est récupéré dans un fichier JSON.
	private confFiltresInsee: any; /// contient la configuration des filtres qui est récupérer dans un fichier JSON.
	private confFiltresRubrique: any; /// contient la configuration des filtres qui est récupérer dans un fichier JSON.
	private confFiltresAladin3: any; /// contient la configuration des filtres qui est récupérer dans un fichier JSON.
	private confGroupeChampCible: any; /// Contient dans un fichier JSON l'équivalent du champ Cible pour les requêtes elastic Search (ex: Partout = _all).
	private groupeChampCible: any; /// Contient dans un fichier JSON l'équivalent du champ Cible pour les requête elastic Search (ex: Partout = _all).
	
	private mainMenuContent: any;

	private requeteService: RequetePageListService;

	constructor(private route: ActivatedRoute, private router: Router, requeteService: RequetePageListService){
		this.requeteService = requeteService;
		this.confMenu = require('../../../conf/menuBB8.json');
		this.confFiltresAladin3 = require('../../../conf/filtresAladin3.json');
		this.confFiltresInsee = require('../../../conf/filtresInsee.json');
		this.confFiltresRubrique = require('../../../conf/filtresRubrique.json');
		this.confGroupeChampCible = require('../../../conf/champCibleConf.json');
		this.groupeChampCible = this.confGroupeChampCible.groupeChampCibleDonneesFixes;
	}

	ngOnInit(){
		this.mainMenuContent = this.confMenu.mainMenu;
	}

	extendWindow(name){
		if (this.windowHeight == true){
			this.windowHeight = false;
			this.nameOfRubrique = "nothing";
		}
		else {
			this.windowHeight = true;
			this.nameOfRubrique = name;
		}
	}

	redirectDataVisualizer(name){
		let link = ['/mainDashboard/dashboard/dashboardDataVisualisation'];
		this.router.navigate(link);		
	}

	chooseIndexElastic(name, index, rubrique){
		this.confFiltresAladin3.filtreSelectionner = "[]";
		this.confFiltresInsee.filtreSelectionner = "[]";
		var id: string;
		rubrique = rubrique.replace(/ /g, "");
		id = name.replace(/ /g, "");
		(rubrique == 'Donnéesfixes') ? (this.groupeChampCible = this.confGroupeChampCible.groupeChampCibleDonneesFixes) : (0);
		(rubrique == 'Insee') ? (this.groupeChampCible = this.confGroupeChampCible.groupeChampCibleInsee) : (0);
		(rubrique == 'Référentiel/Données') ? (this.groupeChampCible = this.confGroupeChampCible.groupeChampCibleRubriques) : (0);
		this.nameSousRubrique = name;
		this.idSousRubrique = id;
		this.currentIndexElasticSearch = index.toLowerCase();
		this.nameRubriquesElasticSearch = rubrique;
		let link = ['/mainDashboard/dashboard',
		'undefined',
		'undefined',
		'undefined',
		false,
		"undefined",
		'addTab',
		'*',
		'Partout',
		0,
		this.currentIndexElasticSearch,
		this.idSousRubrique,
		this.nameSousRubrique,
		this.nameRubriquesElasticSearch,
		10
		];
		this.router.navigate(link);
	}

	goToInterpretation(){
		let link = ['/mainDashboard/dashboard',
		'search Interpretation',
		'search Inter',
		'intepretation',
		false,
		"[]"
		];
		this.router.navigate(link);
	}

	// clickOnBox(item){
	// 	switch (item.id) {
	// 		case "interpretation":
	// 			this.goToInterpretation();
	// 			break;
	// 		case "base_connaissance":
	// 			this.redirectDataVisualizer(item.href)
	// 			break;
	// 		case "Requêtes":
	// 		case "Etablissement":
	// 		case "Rubriques":
	// 		case "CRI":
	// 		case "Marques":
	// 			this.chooseIndexElastic(_defaultParam.labelToolBar, _defaultParam.href, _defaultParam.label)
	// 			break;
	// 		default:
	// 			this.chooseIndexElastic(_defaultParam.labelToolBar, _defaultParam.href, _defaultParam.label);
	// 			break;
	// 	}
	// }

	clickOnBox(item){
		// Redirection Index avec paramètres
		// cf. index r2d2_config/config/_search (exaleadvt.bvbo1t.local:10200)
		switch (item.id) {
			case "interpretation":
				this.goToInterpretation();
				break;
			case "base_connaissance":
				this.redirectDataVisualizer(item.href)
				break;
			case "requete":
				this.chooseIndexElastic("Données 30 jours courant", item.href, "Données fixes");
				break;
			case "etablissement":
				this.chooseIndexElastic("Insee", item.href, "Insee");
				break;
			case "rubrique":
				this.chooseIndexElastic("Rubriques", item.href, "Référentiel / Données");
				break;
			case "cri":
				this.chooseIndexElastic("CRI et Marques", item.href, "Référentiel / Données");
				break;
			case "mots_cles":
				this.chooseIndexElastic("Mots-clefs", item.href, "Référentiel / Données");
				break;
			default:
				this.chooseIndexElastic("Données 30 jours courant", item.href, "Données fixes");
				break;
		}
	}
}