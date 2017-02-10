/**
*
* Ce composant est le composant fils de dashboardB.
* Il permet d'afficher un champ de recherche est une liste de reponses.
* Lorsque l'on clique sur une des réponses dans le tableau on revient dans le composant pére dashboard.
* Ce composant est appelé lorsque il n'y a aucun onglet, ou lorsque l'on appuis sur l'onglet recherche.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RequetePageListService} from '../../service/requeteService';
import {DownloadCsvService} from '../../service/downloadCsvService';
import {ParseurForRecupFiltreService} from '../../service/parseurForRecupFiltreService';
import {VarForElasticSearchService} from '../../service/varForElasticSearchService';
import {FiltresService} from '../../service/filtresService';
import {SelectModule} from 'angular2-select';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import myGlobals = require('../../globals');
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

declare var require: any;

@Component({
	selector   : 'addTab',
	styles: [require('./addTab.css')],
	template: require('./addTab.html')
})
export class AddTab {

  	/// Algolia 
	  	algoliasearch = require('algoliasearch');
	  	private client: any;
	  	private index: any;
		private reponseAutocompletion: any = [];
		private states : any = [];
		private data : any;
	///

		private id : string;
		private idd : string;

	// images
		private logoBB8 : any;
	//

	// variables
		private wait : boolean = false; // savoir si une requête est en cours est ainsi afficher un loader ou non.
		private done : boolean = false; // savoir si une requête est en cours est ainsi afficher un loader ou non.

		private conf: any;
		private confEvenement: any;
		private confUserRights: any;
		private confIndex: any;
		private tabAffectDesaffect: any = [];

		private query : string;
		private currentIndexElasticSearch: string;
		private idSousRubrique: string;
		private nameSousRubrique: string;
		private nameRubriquesElasticSearch: string;
		private quiQuoi : string;
		private champCible: string;
		private nbPage : number;
		private nbResult: number;
		private nameDashboard: string = "undefined";

		private sub : any;
		private varRequeteOnInput : any; /// cette variable est la reponse des requêtes que l'on peut faire avec les différents index elastic Search.
		private nbResultat: any; /// Chiffre que l'on affiche dans la liste déroulante pour séléctionner combien de résultat l'on veut afficher dans le tableau.

		private confFiltresAladin3: any; /// contient la configuration des filtres qui est récupérer dans un fichier JSON.
		private confFiltresInsee: any; /// contient la configuration des filtres qui est récupérer dans un fichier JSON.
		private confFiltresRubrique: any; /// contient la configuration des filtres qui est récupérer dans un fichier JSON.
		private champCible2: string = "nothing";
		private indexElastic: string;
		private recupChampCible: string;
		private indexForRequete: number = 0;
		private fenetreRight: boolean = true;


		private confGroupeChampCible: any; /// Contient dans un fichier JSON l'équivalent du champ Cible pour les requêtes elastic Search (ex: Partout = _all).
		private groupeChampCible: any; /// Contient dans un fichier JSON l'équivalent du champ Cible pour les requête elastic Search (ex: Partout = _all).
		private champCibleSelectionner: string = "Partout";
		private responseConfig: any;
		private responseEmpty: boolean = false; /// Savoir si il y a aucune réponse de la part d'élastic Search. Dans ce cas on affiche une alerte.
		private searchedElement: string;
		private lock: boolean = false;
		private paramRequeteFiltre: string = "undefined";

		private login: string;
		private rightEvt: boolean = false;
	//

	/// Algolia
		private keyAlgolia : string;
		private idAlgolia : string;
		private indexAlgolia : any = [];
	///

	// service
		private requeteService: RequetePageListService;
		private downloadCsvService: DownloadCsvService;
		private parseurForRecupFiltreService: ParseurForRecupFiltreService;
		private varForElasticSearchService: VarForElasticSearchService; /// Service permettant de créer les requêtes élastic Search.
		private filtresService: FiltresService;

	constructor(private router: Router, private route: ActivatedRoute, downloadCsvService: DownloadCsvService, parseurForRecupFiltreService: ParseurForRecupFiltreService, requeteService: RequetePageListService, varForElasticSearchService: VarForElasticSearchService, filtresService: FiltresService){
    	this.requeteService = requeteService;
    	this.downloadCsvService = downloadCsvService;
		this.parseurForRecupFiltreService = parseurForRecupFiltreService;
		this.varForElasticSearchService = varForElasticSearchService;
		this.filtresService = filtresService;
		this.conf = require('../../conf/conf.json');
		this.confEvenement = require('../../conf/confEvenement.json');
		this.confIndex = require('../../conf/index.json');
		this.confFiltresAladin3 = require('../../conf/filtresAladin3.json');
		this.confFiltresInsee = require('../../conf/filtresInsee.json');
		this.confFiltresRubrique = require('../../conf/filtresRubrique.json');
		this.confGroupeChampCible = require('../../conf/champCibleConf.json');
		this.confUserRights = require('../../conf/userRights.json');
		this.groupeChampCible = this.confGroupeChampCible.groupeChampCibleDonneesFixes;
	}

	ngOnInit(){
		this.nbResultat =  [{'nb': 5}, {'nb': 10}, {'nb': 50}, {'nb': 100}, {'nb': 500}, {'nb': 1000}];
		this.sub = this.route.params.subscribe(params => {
			this.paramRequeteFiltre = this.route.snapshot.parent.params['filtres']; /// vu que l'on est dans le composant enfant on ne peut pas récupérer un paramétre appartenant au composant parent avec la voie normal. Pour ceci on utilise "this.route.snapshot.parent.params['...']".
			
			/// attention que pour aladin3
			if (this.paramRequeteFiltre == "undefined" || this.paramRequeteFiltre == undefined){
				this.paramRequeteFiltre = "[]";
				this.confFiltresAladin3.filtreSelectionner = "[]";
				this.confFiltresInsee.filtreSelectionner = "[]";
			}
			else {
				this.confFiltresAladin3.filtreSelectionner = this.paramRequeteFiltre;
				this.confFiltresInsee.filtreSelectionner = this.paramRequeteFiltre;
			}
			this.champCible2 = "nothing";
			this.champCibleSelectionner = params['champCible'];
			this.nameDashboard = this.route.snapshot.parent.params['nameDashboard'];
			this.quiQuoi = this.route.snapshot.parent.params['QuiQuoi'];
			this.idd = this.route.snapshot.parent.params['id'];
			this.query = params['query'];
			this.searchedElement = this.query;
			this.id = params['query'];
			if (params['lockScreen'] != null){
				this.lock = params['lockScreen'];
			}
			this.recupChampCible = params['champCible'];
			this.indexForRequete = +params['nbPage'];
			this.indexElastic = params['indexElastic'];
			this.idSousRubrique = params['idSousRubrique'];
			this.nameSousRubrique = params['nameSousRubrique'];
			this.nameRubriquesElasticSearch = params['nameRubriquesElasticSearch'];
			this.nbResult = +params['nbResult'];

			if (this.query == null){
				this.query = "*";
			}
			if (this.query == "" || this.query == "undefined"){
				this.query = "*";
			}
			(this.indexElastic == '/aladin3') ? (this.groupeChampCible = this.confGroupeChampCible.groupeChampCibleDonneesFixes) : (0);
			(this.indexElastic == '/Insee') ? (this.groupeChampCible = this.confGroupeChampCible.groupeChampCibleInsee) : (0);
			(this.indexElastic == '/rubrique') ? (this.groupeChampCible = this.confGroupeChampCible.groupeChampCibleRubriques) : (0);
			(this.indexElastic == 'baseEtablissement') ? (this.groupeChampCible = this.confGroupeChampCible.groupeChampCibleEtablissement) : (0);
			this.requeteForConfig();
			
			if (this.indexElastic != undefined){
				this.confFiltresAladin3.route[6].indexElastic = this.indexElastic;
				this.confFiltresAladin3.route[6].nameSousRubrique = this.nameSousRubrique;
				this.confFiltresAladin3.route[6].nameRubriquesElasticSearch = this.nameRubriquesElasticSearch;
			}
			this.makeTabAffectDesaffect();
		});
		this.login = myGlobals.login;
		(myGlobals.actions != []) ? (this.checkUserRights()) : (0);
		this.logoBB8 = require("../../images/loaderBB8.gif");
	}
    
    checkUserRights(){
    	this.rightEvt = false;
    	for (let item of myGlobals.actions){
    		for (let right of this.confUserRights.userRights){
    			if (right.label == "Evenement"){
    				if (right.name == item){
    					this.rightEvt = true;
    				}
    			}
 		   	}
    	}
	}

	//// typehead
	public typeaheadOnSelect(e:any):void {
		this.search(e.item);
	}

	autocompl(etab){
		if (this.champCibleSelectionner == "an8 ou an9"){
    		this.index = this.client.initIndex(this.indexAlgolia.indexRubriques);
		}
		else if (this.indexElastic.startsWith("/aladin")){
    		this.index = this.client.initIndex(this.indexAlgolia.indexQuiQuois);
		}
		else if (this.indexElastic == "/rubrique"){
    		this.index = this.client.initIndex(this.indexAlgolia.indexQuiQuois);
    	}
		else if (this.indexElastic == "/insee"){
    		this.index = this.client.initIndex(this.indexAlgolia.indexQuiQuois);
		}

		this.states = [];

		var err: any;
		var content: any;

		var tab: any = [];
		this.data = new Observable(observer => {
			this.index.search(etab, function(err, content){
				for (let item of content.hits){
					tab.push({'name': item.libelle});
				}
				observer.next(tab);
				return (tab);
			});
		});
		let subscription = this.data.subscribe(
			value => this.states = value
		);
	}

	search(query){
		this.responseEmpty = false;
		// if (this.query == null){
		// 	this.query = "*";
		// }
		if (this.query == null || this.query == "" || this.query == "undefined"){
			this.query = "*";
		}
		this.searchedElement = this.query;
		this.goToAddTab();
	}

	requeteForConfig(){
		let elastOptions = {
			"query": {
				"filtered": {
					"query": {
						"bool": {
							"must": [
							{
								"match_all": {}
							}
							]
						}
					},
					"filter": {
						"exists": {
							"field": "Maintenance"
						}
					}
				}
			}
		};
		this.requeteService.requeteForConfig(elastOptions)
		.then(response => {
			this.responseConfig = response;
			for (let item of this.responseConfig.hits.hits){
				this.indexAlgolia = item._source.Algolia;
			}
			this.client = this.algoliasearch(this.indexAlgolia.algoliaClientAppId, this.indexAlgolia.algoliaClientKey);
	    	this.index = this.client.initIndex(this.indexAlgolia.indexQuiQuois);
			this.parseurForRecupFiltreService.parseConfigForNameColonnes(this.responseConfig); // Aladin3
			this.parseurForRecupFiltreService.parseConfigForNameColonnesInsee(this.responseConfig);
			this.parseurForRecupFiltreService.parseConfigForNameColonnesRubrique(this.responseConfig);
			this.chooseChampCible(this.recupChampCible);
			this.chooseWhichRequete(this.idSousRubrique);
		}, error => console.error(error));
	}

	chooseIndexElastic(name, index, rubrique){
		this.paramRequeteFiltre = "undefined";
		this.confFiltresAladin3.filtreSelectionner = "[]";
		this.confFiltresInsee.filtreSelectionner = "[]";
		this.responseEmpty = false;
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
		this.lock,
		this.paramRequeteFiltre,
		'addTab',
		this.query,
		this.champCibleSelectionner,
		this.indexForRequete,
		this.currentIndexElasticSearch,
		this.idSousRubrique,
		this.nameSousRubrique,
		this.nameRubriquesElasticSearch,
		this.nbResult
		];
		this.router.navigate(link);
	}

	setChampCible(champCible){
		this.recupChampCible = champCible;
		this.champCibleSelectionner = champCible;
	}

	chooseWhichRequete(idSousRubrique){
		(this.nameRubriquesElasticSearch == 'Donnéesfixes') ? (this.requeteOnInputAladin3ET4(this.query, this.champCible, this.indexForRequete)) : (0);
		(this.nameRubriquesElasticSearch == 'Insee') ? (this.requeteOnInputInsee(this.query, this.champCible, this.indexForRequete)) : (0);
		(this.nameRubriquesElasticSearch == 'Etablissement') ? (this.requeteOnInputEtablissement(this.query)) : (0);
		if (this.nameRubriquesElasticSearch == "Référentiel/Données"){
			(idSousRubrique == 'Rubriques') ? (this.requeteOnInputRubrique(this.query, this.champCible, this.champCible2, this.indexForRequete)) : (0);
			(idSousRubrique == 'CRIetMarques') ? (this.requeteOnInputCRIEtMarques(this.query, this.champCible, this.champCible2, this.indexForRequete)) : (0);
			(idSousRubrique == 'Mots-clefs') ? (this.requeteOnInputMotsClefs(this.query, this.champCible, this.champCible2, this.indexForRequete)) : (0);
		}
	}

    /**
     * Comment for method 'requeteOnInputAladin3ET4'.
     * Cette méthode permet de faire une requête aladin3.
     * Pour construire notre requête nous faisons appele au service this.varForElasticSearchService.elastOptionAladin3ET4().
     * Cette méthode du service nous permmetera de construire notre requête en fonction des filtres.
     */
	requeteOnInputAladin3ET4(event, champCible, indexForRequete){
		this.wait = true;
		this.done = false;
		if (!event) { return;}
		let elastOptions = this.varForElasticSearchService.elastOptionAladin3ET4(event, champCible, indexForRequete, this.nbResult, this.paramRequeteFiltre);
		this.requeteService.requeteOnInput(event, elastOptions, this.indexElastic)
		.then(response => {
			this.functionReponseRequete(response);
		}, error => console.error(error));
	}


	requeteOnInputInsee(event, champCible, indexForRequete){
		this.wait = true;
		this.done = false;
		if (!event) { return;}
		let elastOptions = this.varForElasticSearchService.elastOptionInsee(event, champCible, indexForRequete, this.nbResult, this.paramRequeteFiltre);
		this.requeteService.requeteOnInput(event, elastOptions, this.indexElastic)
		.then(response => {
			this.functionReponseRequete(response);
		}, error => console.error(error));
	}

	requeteOnInputEtablissement(event){
		this.wait = true;
		this.done = false;
		if (!event) { return;}
		let elastOptions = {
			"from": "0",
			"query": {
				"bool": {
					"must": [
					{
						"query_string": {
							"default_operator": "AND",
							"fields": [this.champCible],
							"query": event
						}
					}
					]
				}
			},
			"size" : 10
		};

		this.requeteService.requeteOnInputEtablissement(event, elastOptions)
		.then(response => {
			this.functionReponseRequete(response);
		}, error => console.error(error));
	}

	requeteOnInputRubrique(event, champCible, champCible2, indexForRequete){
		this.wait = true;
		this.done = false;
		if (!event) { return;}
		let elastOptions = this.varForElasticSearchService.elastOptionRubrique(event, champCible, champCible2, indexForRequete, this.nbResult, this.paramRequeteFiltre);
		this.requeteService.requeteOnInputUrlRub(event, elastOptions, this.confIndex.index.rubriques)
		.then(response => {
			this.functionReponseRequete(response);
		}, error => console.error(error));
	}

	requeteOnInputCRIEtMarques(event, champCible, champCible2, indexForRequete){
		this.wait = true;
		this.done = false;
		if (!event) { return;}
		let elastOptions = this.varForElasticSearchService.elastOptionCRIEtMarques(event, champCible, champCible2, indexForRequete, this.nbResult);
		this.requeteService.requeteOnInput(event, elastOptions, this.confIndex.index.criEtMarque)
		.then(response => {
			this.functionReponseRequete(response);
		}, error => console.error(error));
	}

	requeteOnInputMotsClefs(event, champCible, champCible2, indexForRequete){
		this.wait = true;
		this.done = false;
		let elastOptions = this.varForElasticSearchService.elastOptionMotsClefs(event, champCible, champCible2, indexForRequete, this.nbResult);
		this.requeteService.requeteOnInput(event, elastOptions, this.confIndex.index.motsClefs)
		.then(response => {
			this.functionReponseRequete(response);
		}, error => console.error(error));
	}

	functionReponseRequete(response){
		this.varRequeteOnInput = response;
		if (!response){
			this.responseEmpty = true;
		}
		else {
			this.responseEmpty = false;
		}
		this.done = true;
	}

	setNbResult(nbResult){
		this.nbResult = nbResult;
		let link = ['/mainDashboard/dashboard',
			this.quiQuoi,
			this.idd,
			'undefined',
			this.lock,
			this.paramRequeteFiltre,
			'addTab',
			this.query,
			this.recupChampCible,
			this.indexForRequete,
			this.indexElastic,
			this.idSousRubrique,
			this.nameSousRubrique,
			this.nameRubriquesElasticSearch,
			this.nbResult
		];
		this.router.navigate(link);
	}

	previousInRequete(){
		if (this.indexForRequete == 0){
			return;
		}
		this.indexForRequete -= 10;
		let link = ['/mainDashboard/dashboard',
		this.quiQuoi,
		this.idd,
		'undefined',
		this.lock,
		this.paramRequeteFiltre,
		'addTab',
		this.query,
		this.recupChampCible,
		this.indexForRequete,
		this.indexElastic,
		this.idSousRubrique,
		this.nameSousRubrique,
		this.nameRubriquesElasticSearch,
		this.nbResult
		];
		this.router.navigate(link);
	}

	nextInRequete(){
		this.indexForRequete += 10;
		let link = ['/mainDashboard/dashboard',
		this.quiQuoi,
		this.idd,
		'undefined',
		this.lock,
		this.paramRequeteFiltre,
		'addTab',
		this.query,
		this.recupChampCible,
		this.indexForRequete,
		this.indexElastic,
		this.idSousRubrique,
		this.nameSousRubrique,
		this.nameRubriquesElasticSearch,
		this.nbResult
		];
		this.router.navigate(link);
	}

	redimensionFenetreSmall(){
		this.fenetreRight = true;
	}

	redimensionFenetre() {
		// (this.fenetreRight == true) ? (this.fenetreRight = false) : (this.fenetreRight = true);
		this.fenetreRight = !this.fenetreRight;
	}

	chooseChampCible(champCible){
		(champCible == "Partout") ? (this.champCible = "_all") : (0); 
		(champCible == "QuiQuoi contient") ? (this.champCible = "quiquois.key") : (0); 
		(champCible == "QuiQuoi exact") ? (this.champCible = "quiquois.key.facet") : (0); 
		(champCible == "Où contient") ? (this.champCible = "ou_locs.key") : (0); 
		(champCible == "QuiQuoi normalisé contient") ? (this.champCible = "quiQuoi_normalized") : (0); 
		(champCible == "QuiQuoi normalisé exact") ? (this.champCible = "quiQuoi_normalized.facet") : (0); 
		(champCible == "Commentaires") ? (this.champCible = "evt.comment") : (0); 

		(champCible == "Libéllé contient") ? (this.champCible = "libelle") : (0); 
		(champCible == "Libéllé exact") ? (this.champCible = "libelle.facet") : (0); 
		(champCible == "an8 ou an9") ? (this.champCible = "code_an8.facet", this.champCible = "code_an9.facet") : (0); 

		(champCible == "Forme Normal") ? (this.champCible = "forme_normale.facet") : (0); 
		(champCible == "Forme de Surface contient") ? (this.champCible = "forme_affichage") : (0); 
		(champCible == "Forme de Surface extact") ? (this.champCible = "forme_affichage.facet") : (0); 

		(champCible == "id père") ? (this.champCible = "id_pere.facet") : (0); 
		(champCible == "Forme Normal") ? (this.champCible = "id_cri.facet") : (0); 
	}

	goToAddTab(){
		if (this.confFiltresInsee.route[0].state == true){
			let link = ['/mainDashboard/dashboard',
				this.quiQuoi,
				this.idd,
				this.nameDashboard,
				this.lock,
				this.paramRequeteFiltre,
				'addTab',
				this.query,
				this.recupChampCible,
				this.indexForRequete,
				this.indexElastic,
				this.idSousRubrique,
				this.nameSousRubrique,
				this.nameRubriquesElasticSearch,
				this.nbResult
			];
			this.router.navigate(link);
			setTimeout(() => {  
				this.ngOnInit();
			}, 500); /// car lorsque l'on fait 'this.router.navigate(link)' cela doit arrivé dans ngOnInit mais sa ne le fait pas.
					 /// Donc on l'appel nous même.
		}
		else if (this.confFiltresInsee.route[1].state == true){
			let link = ['/mainDashboard/dashboard',
				this.quiQuoi,
				this.idd,
				this.nameDashboard,
				this.lock,
				this.paramRequeteFiltre,
				'addTab',
				this.query,
				"Partout",
				0,
				"baseEtablissement",
				"baseEtablissement",
				"Etablissement",
				"Etablissement",
				this.nbResult
			];
			this.router.navigate(link);
			setTimeout(() => {  
				this.ngOnInit();
			}, 500); /// car lorsque l'on fait 'this.router.navigate(link)' cela doit arrivé dans ngOnInit mais sa ne le fait pas.
					 /// Donc on l'appel nous même.
		}
	}

	goToAddTabAladin3(){
		this.confFiltresAladin3.route[6].indexElastic = this.chooseNewIndexElastic();
		let link = ['/mainDashboard/dashboard',
			this.quiQuoi,
			this.idd,
			this.nameDashboard,
			this.lock,
			this.paramRequeteFiltre,
			'addTab',
			this.query,
			"Partout",
			"0",
			this.confFiltresAladin3.route[6].indexElastic,
			this.confFiltresAladin3.route[6].idSousRubrique,
			this.confFiltresAladin3.route[6].nameSousRubrique,
			this.confFiltresAladin3.route[6].nameRubriquesElasticSearch,
			this.nbResult
		];
		this.router.navigate(link);
		setTimeout(() => {  
			this.ngOnInit();
		}, 500); /// car lorsque l'on fait 'this.router.navigate(link)' cela doit arrivé dans ngOnInit mais sa ne le fait pas.
				 /// Donc on l'appel nous même.
	}

	goToAddTabInsee(){
		this.confFiltresAladin3.route[6].indexElastic = this.chooseNewIndexElastic();
		let link = ['/mainDashboard/dashboard',
			this.quiQuoi,
			this.idd,
			this.nameDashboard,
			this.lock,
			"undefined",
			'addTab',
			this.query,
			"Partout",
			"0",
			"/insee",
			"Insee",
			"Insee",
			"Insee",
			this.nbResult
		];
		this.router.navigate(link);
		setTimeout(() => {  
			this.ngOnInit();
		}, 500); /// car lorsque l'on fait 'this.router.navigate(link)' cela doit arrivé dans ngOnInit mais sa ne le fait pas.
				 /// Donc on l'appel nous même.
	}

	chooseNewIndexElastic(){
		let _result = this.confFiltresAladin3.route[6].indexElastic;
		if (this.confFiltresAladin3.route[6].nameRubriquesElasticSearch == "Donnéesfixes"){
			switch (this.confFiltresAladin3.route[6].nameSousRubrique) {
				case "Données 30 jours courant":
					_result = "/aladin3";
					break;
				case "Données 150 jours courant":
					_result = "/aladin4";
					break;
				case "Données 30 jours précédent":
					_result = "/aladin1";
					break;
				case "Données 150 jours précédent":
					_result = "/aladin2";
					break;
				default:
					_result = "/aladin3";
					break;
			}
		}
		else if (this.confFiltresAladin3.route[6].nameRubriquesElasticSearch == "Donnéesmobiles"){
			switch (this.confFiltresAladin3.route[6].nameSousRubrique) {
				case "Données mobiles 30 jours courant":
					_result = "/donneesmobiles3";
					break;
				case "Données mobiles 150 jours courant":
					_result = "/donneesmobiles4";
					break;
				case "Données mobiles 30 jours précédent":
					_result = "/donneesmobiles1";
					break;
				case "Données mobiles 150 jours précédent":
					_result = "/donneesmobiles2";
					break;
				default:
					_result = "/donneesmobiles3";
					break;
			}
		}
		return _result;
	}

	/**
	 * Comment for method 'affecterFiltres'.
	 * Methode qui permet d'apperler un service qui permet d'affecter les filtres.
	 * Voir filtresService.affecterFiltreAladin3 pour prendre en compte un nouveau filtre.
	 * Puis voir la méthode requeteOnInputAladin3ET4() par exemple pour voir comment il sont pris en compte dans une requête.
	 */
	affecterFiltres(){
		// if (this.indexElastic == "/aladin3" || this.indexElastic == "/aladin4" || this.indexElastic == "/aladin2" || this.indexElastic == "/aladin1"){
		if (this.indexElastic.startsWith("/aladin")){
			this.paramRequeteFiltre = this.filtresService.affecterFiltreAladin3(this.paramRequeteFiltre);
			this.confFiltresAladin3.filtreSelectionner = this.paramRequeteFiltre;
			this.goToAddTabAladin3();
		}
		else if (this.indexElastic == "/insee"){
			this.paramRequeteFiltre = this.filtresService.affecterFiltreInsee(this.paramRequeteFiltre);
			this.confFiltresInsee.filtreSelectionner = this.paramRequeteFiltre;
			this.goToAddTab();
		}
		else if (this.indexElastic == "baseEtablissement"){
			this.goToAddTabInsee();
		}
		else if (this.indexElastic == "/rubrique"){
			this.paramRequeteFiltre = this.filtresService.affecterFiltreRubrique(this.paramRequeteFiltre);
			this.confFiltresRubrique.filtreSelectionner = this.paramRequeteFiltre;
			this.goToAddTab();
		}
	}
	//////////

	//// deleteAllFiltres

	deleteAllFiltres(){
		// if (this.indexElastic == "/aladin3" || this.indexElastic == "/aladin4" || this.indexElastic == "/aladin2" || this.indexElastic == "/aladin1"){
		if (this.indexElastic.startsWith("/aladin")){
			this.confFiltresAladin3.filtreSelectionner = "[]";
			for (let item of this.confFiltresAladin3.filtresAvanceAvecInput){
	            item.state = false;
	        }
	        for (let item of this.confFiltresAladin3.filtresAvanceAvecInput2){
	            item.state = false;
	        }
	        for (let item of this.confFiltresAladin3.filtresAvanceTypeDernierEvenement){
	        	item.state = false;
	        }
	        for (let item of this.confFiltresAladin3.filtresAvanceDernierUtilisateurEvenement){
	        	item.state = false;
	        }
	        for (let item of this.confFiltresAladin3.filtresBasicTypeDernierEvenement){
	        	item.state = false;
	        }
	        for (let item of this.confFiltresAladin3.filtresBasicDernierUtilisateurEvenement){
	        	item.state = false;
	        }
	        for (let item of this.confFiltresAladin3.filtresBasicDernierUtilisateurAffectations){
	        	item.state = false;
	        }
	        for (let item of this.confFiltresAladin3.filtresBasicStatuts){
	        	item.state = false;
	        }
	        for (let item of this.confFiltresAladin3.typologie){
	        	item.state = false;
	        }
    	}
		else if (this.indexElastic == "/insee"){
			this.confFiltresInsee.filtreSelectionner = "[]";
			for (let item of this.confFiltresInsee.filtresAvanceAvecInput){
	            item.state = false;
	        }
		}
		else if (this.indexElastic == "/rubrique"){
			this.confFiltresRubrique.filtreSelectionner = "[]";
			for (let item of this.confFiltresRubrique.filtresAvanceAvecInput){
	            item.state = false;
	        }
	        for (let item of this.confFiltresRubrique.filtresBasicListeCategorieDeRubriquage){
	        	item.state = false;
	        }
	        for (let item of this.confFiltresRubrique.filtresBasicListeNature){
	        	item.state = false;
	        }
		}
		this.paramRequeteFiltre = "[]";
		this.goToAddTab();
	}

	goBack(){
		let link = ['/mainDashboard/dashboard',
			'undefined',
			'undefined',
			'menu',
			false,
			'[]'
		];
        this.router.navigate(link);
	}

	downloadCsv(){
		(this.indexElastic.startsWith("/aladin")) ? (this.downloadCsvService.downloadCsvTableauAladin3(this.varRequeteOnInput)) : (0);
	}

	makeTabAffectDesaffect(){
		for (let item of this.confEvenement.AffectationDesaffectation){
			this.tabAffectDesaffect.push({"label": item.name, "value": item.name});
		}
	}
}