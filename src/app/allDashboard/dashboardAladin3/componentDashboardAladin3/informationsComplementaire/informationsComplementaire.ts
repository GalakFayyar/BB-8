/**
*
* Ce composant permet d'afficher les différentes colonnes que l'on peur retrouver dans R2D2.
* Une popup permet de gérer les différentes boites à afficher.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Pipe, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RequetePageListService} from '../../../../../service/requeteService';
import {DownloadCsvService} from '../../../../../service/downloadCsvService';
import {NgGrid, NgGridItem} from 'angular2-grid';
import {DomSanitizer} from "@angular/platform-browser";
import { Cookie } from 'ng2-cookies/ng2-cookies';

import myGlobals = require('../../../../../globals');

declare var require: any;

@Component({
	selector   : 'informationsComplementaire',
	styles: [require('./informationsComplementaire.css'), require('../../../../../css/cssGlobal.css')],
	template: require('./informationsComplementaire.html')
})
export class InformationsComplementaire {
	/// variables
	private wait : boolean = false; // savoir si une requête est en cours est ainsi afficher un loader ou non.
	private done : boolean = false; // savoir si une requête est en cours est ainsi afficher un loader ou non.

	private sub : any;
	private conf : any;
	private confIndex : any;
	private connect : boolean = false;
	private quiQuoi: string;
	private id: string;
	private colonnes: any;
	private nameVarTab: any = [];
	private tabDisplayStat1: any;
	private responseRequete: any;
	private responseConfig: any;
	private QuiQuoi: any;
	private lockScreen: boolean = false;
	private filtres: any = [];
	private requeteService: RequetePageListService;
	private downloadCsvService: DownloadCsvService;
	///

	/// images
	private loaderGif: any;
	///

	constructor(private route: ActivatedRoute, private router: Router, private domSanitizer : DomSanitizer, downloadCsvService: DownloadCsvService, requeteService: RequetePageListService){
    	this.downloadCsvService = downloadCsvService;
		this.requeteService = requeteService;
		this.conf = require('../../../../../conf/conf.json');
		this.confIndex = require('../../../../../conf/index.json');
	}

	ngOnInit(){
		this.loaderGif = require("../../../../../images/loaderBB8.gif");
		if (Cookie.get('tabInformationsCompl') != null){
			let cookies = Cookie.get('tabInformationsCompl');
			this.tabDisplayStat1 = JSON.parse(cookies);
		}
		else {
			this.tabDisplayStat1 = [
				{"name": 'QuiQuoi Normalisé', "state": true},
				{"name": 'Traitée', "state": true},
				{"name": 'Robot', "state": true},
				{"name": 'Action Métier', "state": true},
				{"name": 'Type dernier événement', "state": true},
				{"name": 'Date dernier événement', "state": true},
				{"name": 'Utilisateur dernier événement', "state": true},
				{"name": 'Fréquence Mensuelle', "state": true},
				{"name": 'Reformulation + cliquée', "state": true},
				{"name": 'Taux de reformulation', "state": true},
				{"name": 'Taux de PDR', "state": true},
				{"name": 'Taux de Proxy', "state": true},
				{"name": 'Score de Fragilité', "state": true},
				{"name": 'Quiquoi + Fréquent', "state": true},
				{"name": 'Reformulation + fréquente', "state": true},
				{"name": 'Taux Clic Annonce', "state": true},
				{"name": 'Taux de Café Chantenay', "state": true},
				{"name": 'Taux de P/N', "state": true},
				{"name": 'Taux de Marque', "state": true},
				{"name": 'Delta Fréquence PDR', "state": true}
			];
		}
		let tabDisplay1String = JSON.stringify(this.tabDisplayStat1);
		Cookie.set('tabInformationsCompl', tabDisplay1String, 10);
		var varCurrentSearch : any;
		if (myGlobals.connect == true){
			this.connect = true;
		}
		else {
			this.connect = false;
		}
		this.sub = this.route.params.subscribe(params => {
			this.requeteOnInputAladin3ET4(params['id'], params['QuiQuoi']);
			this.quiQuoi = params['QuiQuoi'];
			this.id = params['id'];
			this.lockScreen = params['lockScreen'];
			this.filtres = params['filtres'];
		});
	}

	requeteOnInputAladin3ET4(id, quiQuoi){
		this.wait = true;
		this.done = false;
		if (!id) { return;}
		let elastOptions = {
			"query": {
				"term": {
					"_id": {
						"value": id
					}
				}
			}
		};
		this.requeteService.requeteDashboard(id, elastOptions, this.confIndex.index.aladin3)
		.then(response => {
			this.responseRequete = response;
			this.requeteForConfig(quiQuoi);
		}, error => console.error(error));
	}

	requeteForConfig(event){
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
			this.colonnes = [];
			this.parseConfigForNameColonnes(this.responseConfig);
			this.recupVarCol(this.responseRequete);
			this.done = true;
		}, error => console.error(error));
	}

	parseConfigForNameColonnes(responseConfig){
		var nameVar: string = "item2._source.";
		var i : number = 0;
		var cpt : number = 0;
		var len: number = 0;
		for (let res of responseConfig.hits.hits){
			for (let resView of res._source.ColonnesAladin1){
				let str: any = resView.view;
				len = str.length;
				i = 0;
				while (i < len){
					if (str[i] == 'e' && str[i + 1] == '.'){
						i = i + 2;
						cpt = 0;
						while (str[i] != ',' && str[i] != ' ' && str[i] != '|' && i < len - 1){
							nameVar += str[i];
							cpt += 1;
							i += 1;
						}
					}
					i += 1;
				}
				if (resView.label[0] != 'L' && resView.label[1] != 'i'){
					this.nameVarTab.push({"name": resView.label, "variable": nameVar});
				}
				nameVar = "item2._source.";
			}
		}
	}

	recupVarCol(response){
		/// Cette fonction permet de recupérer l'état des champ qui sont affiché dans les deux tableaux.
		/// Cela permet que les tableaux vont chercher des valeurs dans un objet et de ne pas mettre les valeurs en dur.
		let tabDisplay1String = JSON.stringify(this.tabDisplayStat1);
		Cookie.set('tabInformationsCompl', tabDisplay1String, 10);
		this.colonnes = [];
		for (let item of this.nameVarTab){
			for (let tab of this.tabDisplayStat1){
				if (tab.name == item.name && tab.state == true){
					for (let item2 of this.responseRequete.hits.hits){	
						this.colonnes.push({"name": item.name, "state": true, "val": eval(item.variable)});
					}
				}
				else {
					for (let item2 of this.responseRequete.hits.hits){
						this.colonnes.push({"name": item.name, "state": false, "val": eval(item.variable)});
					}
				}
			}
		}
	}

	modifState(name){
		for (let item of this.tabDisplayStat1){
			if (item.name == name){
				if (item.state == true){
					item.state = false;
				}
				else {
					item.state = true;
				}
			}
		}
		this.recupVarCol(this.responseConfig);
	}

	modifStateAllActiv(){
		for (let item of this.tabDisplayStat1){
			item.state = true;
		}
		this.recupVarCol(this.responseConfig);
	}

	modifStateAllNone(){
		for (let item of this.tabDisplayStat1){
			item.state = false;
		}
		this.recupVarCol(this.responseConfig);
	}

	goToOuContient(query){
		let link = ['/mainDashboard/dashboard',
		this.quiQuoi,
		this.id,
		'aladin3',
		this.lockScreen,
		this.filtres,
		'addTab',
		query,
		'Où contient',
		'0',
		'/aladin3',
		'Donnéesfixes',
		'Données 30 jours courant',
		'Donnéesfixes',
		'10'
		];
		this.router.navigate(link);
	}

	goToAddTabForReformulation(query){
		let link = ['/mainDashboard/dashboard',
		this.quiQuoi,
		this.id,
		'aladin3',
		this.lockScreen,
		this.filtres,
		'addTab',
		query,
		'Partout',
		'0',
		'/aladin3',
		'Donnéesfixes',
		'Données 30 jours courant',
		'Donnéesfixes',
		'10'
		];
		this.router.navigate(link);	
	}

	downloadCsv(){
		this.downloadCsvService.downloadCsvRequeteAladin3(this.responseRequete);
	}
}