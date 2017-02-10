/**
*
* Ce composant permet d'afficher les différents onglets.
* Quant au composant qui compose le dashboard ceci se fait dans d'autres composants qui sont dans le dossier "composantDashboard".
* Ceci permet d'étre modulaire et d'ajouter une seul ligne pour ajouter un nouveau dashboard.
* S'il n'y a pas d'onglet (par exemple en faisant : localhost:3000), ou lorsque l'on appuie sur l'onglet recherche, alors on appel le composant addTab pour afficher un composant de recherche.
* Le composant addTab est le composant fils de dashboard, qui lui est le composant fils de mainDashboard.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Pipe} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RequetePageListService} from '../../service/requeteService';
import {Cookie} from 'ng2-cookies/ng2-cookies';

import myGlobals = require('../../globals');
declare var require: any;

@Component({
  selector   : 'dashboard',
  styles: [require('./dashboard.css')],
  template: require('./dashboard.html')
})
export class Dashboard {
	/// images
		private loaderGif: any;
	///

	/// variables
		private wait : boolean = false; // savoir si une requête est en cours est ainsi afficher un loader ou non.
		private done : boolean = false; // savoir si une requête est en cours est ainsi afficher un loader ou non.

		private conf : any;
		private confFiltresAladin3 : any;
		private confFiltresInsee : any;
		private sub: any;
		private quiQuoi: string;
		private id: string;
		private nameDashboard: string;
		private lock: boolean = false; // verouiller le deplacement des composants
		private connect: boolean = false; /// savoir si la personne est connecté avec son compte, pour afficher différent composants en plus.
		private fenetreDashboard: any = []; /// Contient tous les id et libelle des requêtes à affiché comme onglets + l'onglet actuellement séléctionner.
		private varCurrentSearch: string = ""; /// Contient l'onglet actuellement séléctionner.
		private fentreDashboardEmpty: boolean = false; /// Savoir s'il reste ou non des onglets. Si non on affiche un onglet new.
		private displayNoneDashboardVar : boolean = false; /// Afficher le dashboard ou pas. On ne va pas l'afficher si on à appuyer sur new onglet.
		private addNewWindows: boolean = false; /// Variable qui permet de savoir si on est sur l'onglet 'nouvel onglet'
		private varDisplayButtonAffichageComposant: boolean = false;
	///

		private currentIndexElasticSearch: string = "/aladin3";
		private idSousRubrique: string = "Donnéesfixes";
		private nameSousRubrique: string = "Données 30 jours courant";
		private nameRubriquesElasticSearch: string = "Donnéesfixes";
		private champCible: string = "Partout";
		private nbPage : number = 0;
		private nbResult: number = 10;
		private paramRequeteFiltre: string = "undefined";

	////////

	//// services
		private requeteService: RequetePageListService;
	////

	constructor(private route: ActivatedRoute, private router: Router, requeteService: RequetePageListService){
		this.requeteService = requeteService;
		this.conf = require('../../conf/conf.json');
	}

	ngOnInit(){
		this.lock = false;
		this.fentreDashboardEmpty = false;
		this.loaderGif = require("../../images/loaderBB8.gif");
		this.confFiltresAladin3 = require('../../conf/filtresAladin3.json');
		this.confFiltresInsee = require('../../conf/filtresInsee.json');
		this.sub = this.route.params.subscribe(params => {
			this.addNewWindows = false;
			this.displayNoneDashboardVar = false;
			this.quiQuoi = params['QuiQuoi'];
			this.id = params['id'];
			this.nameDashboard = params['nameDashboard'];
			this.paramRequeteFiltre = params['filtres'];
			if (params['lockScreen'] == 'false'){
				this.lock = false;
			}
			else {
				this.lock = true;
			}
			this.varCurrentSearch = this.id;
			/// verif si un onglet du même id et déjà créer
			let goToRequete : boolean = true;
			for (let item of myGlobals.fenetreDashboard){
				if (item.id == this.id && this.nameDashboard == item.nameDashboard){
					goToRequete = false;
    				for (let item of myGlobals.fenetreDashboard){
						if (item.libelle == "getCurrentSearch"){
							item.getCurrentSearch = this.varCurrentSearch;
						}
					}
    				this.fenetreDashboard = myGlobals.fenetreDashboard;
				}
			}

			///// Savoir si il n'y a pas d'onglet
			if (goToRequete == true && this.quiQuoi != null && this.quiQuoi != "undefined"){
				let dateRequetes : string;
				(this.nameDashboard.indexOf("aladin") == -1 && this.nameDashboard.indexOf("donneesmobiles") == -1) ? (dateRequetes = "Nothing") : (dateRequetes = this.confFiltresAladin3.route[6].nameSousRubrique);
				myGlobals.fenetreDashboard.push({"libelle": this.quiQuoi, "id": this.id, "nameDashboard": this.nameDashboard, "dateRequetes": dateRequetes});
				myGlobals.fenetreDashboard.push({"libelle": 'lockScreen', "lock": this.lock});
    			myGlobals.fenetreDashboard.push({"libelle": "getCurrentSearch", "getCurrentSearch": this.id});
    			this.fenetreDashboard = myGlobals.fenetreDashboard;
			}

			/// Dans ce cas on appele le menu
			if (this.quiQuoi == null || this.quiQuoi == "") {
				let link = ['/mainDashboard/dashboard',
					'undefined',
					'undefined',
					'menu',
					false,
					this.paramRequeteFiltre
				];
		        this.router.navigate(link);
			}
			this.displayButtonAffichageComposant();
		});
		if (myGlobals.connect == true){
			this.connect = true;
		}
		else {
			this.connect = false;
		}
	}

	displayButtonAffichageComposant(){
		if (this.nameDashboard == 'aladin3'
			|| this.nameDashboard == 'Insee'
			|| this.nameDashboard == 'rubrique'
			|| this.nameDashboard == 'intepretation'){
			if (this.addNewWindows == false){
				this.varDisplayButtonAffichageComposant = true;
			}
			else{
				this.varDisplayButtonAffichageComposant = false;
			}
		}
		else {
			this.varDisplayButtonAffichageComposant = false;
		}
	}

	lockScreen(){
		(this.lock == true) ? (this.lock = false) : (this.lock = true);
		(this.lock == false) ? (myGlobals.login = "undefined") : (0);
		let link = ['/mainDashboard/dashboard',
			this.quiQuoi,
			this.id,
			this.nameDashboard,
			this.lock,
			this.paramRequeteFiltre
		];
        this.router.navigate(link);
	}

	currentSearch(currentSearch){
		this.varCurrentSearch = currentSearch;
		for (let item of myGlobals.fenetreDashboard){
			if (item.libelle == "getCurrentSearch"){
				item.getCurrentSearch = currentSearch;
			}
		}
		for (let item of this.fenetreDashboard){
			if (item.libelle == "getCurrentSearch"){
				item.getCurrentSearch = currentSearch;
			}
		}
	}

	removeFenetre(id, nameDashboard){
		/// appuie sur la croix des différentes fenetres.
		var cpt : number = 0;
		var libelleTmp: string;
		var existFenetre : boolean = false;
		var newFenetreDashboard : any = [];
		//// Je sauvegarde les fenetres restante sans prendre en compte celle à effacer.
		for (let item of this.fenetreDashboard){
			if (item.libelle != "getCurrentSearch" && item.libelle != 'lockScreen'){
				if (item.id != id || item.nameDashboard != nameDashboard) {
				// if (item.id != id) {
					newFenetreDashboard.push({"libelle": item.libelle, "id": item.id, "nameDashboard": item.nameDashboard, "varCurrentSearch": this.varCurrentSearch, "dateRequetes": item.dateRequetes});
				}
			}
		}
		for (let item of this.fenetreDashboard){
			if (item.libelle == "getCurrentSearch" && item.libelle != 'lockScreen'){
		       	newFenetreDashboard.push({"libelle": "getCurrentSearch", "getCurrentSearch": ""});
			}
		}
		for (let item of this.fenetreDashboard){
			if (item.libelle == "lockScreen"){
		       	newFenetreDashboard.push({"libelle": "lockScreen", "lock": this.lock});
			}
		}
		/// Ecrasement du tableau qui contient toutes les fenetres.
		myGlobals.fenetreDashboard = newFenetreDashboard;
		this.fenetreDashboard = newFenetreDashboard;
		/// rafraichissement de l'objet qui contient la fenetre à afficher.
		for (let item of this.fenetreDashboard){
			if (cpt == 0 && item.libelle != "getCurrentSearch" && item.libelle != 'lockScreen'){
				libelleTmp = item.id;
				existFenetre = true;
				cpt += 1;
			}
		}
		for (let item of myGlobals.fenetreDashboard){
			if (item.libelle == "getCurrentSearch"){
				item.getCurrentSearch = libelleTmp;
			}
		}
		for (let item of this.fenetreDashboard){
			if (item.libelle == "getCurrentSearch"){
				item.getCurrentSearch = libelleTmp;
			}
		}
		if (existFenetre == false){
			this.fentreDashboardEmpty = true;
			this.varCurrentSearch = libelleTmp;
			let link = ['/mainDashboard/dashboard',
				"undefined",
				"undefined",
				this.nameDashboard,
				this.lock,
				this.paramRequeteFiltre,
				'addTab',
				'*',
				this.champCible,
				this.nbPage,
				this.confFiltresAladin3.route[6].indexElastic,
				this.confFiltresAladin3.route[6].nameSousRubrique,
				this.confFiltresAladin3.route[6].nameSousRubrique,
				this.confFiltresAladin3.route[6].nameRubriquesElasticSearch,
				this.nbResult
			];
	        this.router.navigate(link);
		}
		this.varCurrentSearch = libelleTmp;
	}

	displayNoneDashboard(){
		this.displayNoneDashboardVar = true;
	}

	displayDashboard(){
		this.addNewWindows = false;
		this.displayNoneDashboardVar = false;
	}

	clickAddNewWindows(){
		this.addNewWindows = true;
		this.displayButtonAffichageComposant();
	}

	goToDashboard(){
		let link = ['/mainDashboard/dashboard',
			this.quiQuoi,
			this.id,
			this.nameDashboard,
			this.lock,
			this.paramRequeteFiltre,
			'addTab',
			'*',
			this.champCible,
			this.nbPage,
			this.confFiltresAladin3.route[6].indexElastic,
			this.confFiltresAladin3.route[6].nameSousRubrique,
			this.confFiltresAladin3.route[6].nameSousRubrique,
			this.confFiltresAladin3.route[6].nameRubriquesElasticSearch,
			this.nbResult
		];
        this.router.navigate(link);
	}

	tgoToMenu(){
		let link = ['/mainDashboard/dashboard',
			'undefined',
			'undefined',
			'menu',
			false,
			'[]'
		];
        this.router.navigate(link);
	}
}