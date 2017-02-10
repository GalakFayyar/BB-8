/**
*
* Ce composant permet d'afficher le composant Evenement.
* On va pouvoir créer des évenements, des affectations/Désaffectaions en fonction des droits des utilisateurs.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';
import {RequetePageListService} from '../../../../../service/requeteService';
import {ActivatedRoute, Router} from '@angular/router';
import {SelectModule} from 'angular2-select';
import myGlobals = require('../../../../../globals');

declare var require: any;

@Component({
  selector   : 'evts',
  styles: [require('./evts.css'), require('../../../../../css/cssGlobal.css')],
  template: require('./evts.html')
})
export class Evts {

	private done: boolean = false;
	private sub: any;
	private quiQuoi: any;
	private id: any;
	private lockScreen: any;
	private rightEvt: boolean = false;
	private filtres: any;
	private confIndex: any;
	private confEvenement: any;
	private confUserRights: any;
	private evt: any = [];
	private tabEvenement: any = [];
	private responseRequete: any;
	private login: string;

	private requeteService: RequetePageListService;

    constructor(private route: ActivatedRoute, private router: Router, requeteService: RequetePageListService){
		this.requeteService = requeteService;
		this.confIndex = require('../../../../../conf/index.json');
		this.confEvenement = require('../../../../../conf/confEvenement.json');
		this.confUserRights = require('../../../../../conf/userRights.json');
    }

    ngOnInit(){
		this.sub = this.route.params.subscribe(params => {
			this.requeteOnInputAladin3ET4(params['id'], params['QuiQuoi']);
			this.quiQuoi = params['QuiQuoi'];
			this.id = params['id'];
			this.lockScreen = params['lockScreen'];
			this.filtres = params['filtres'];
			this.login = myGlobals.login;
			(myGlobals.actions != []) ? (this.checkUserRights()) : (0);
		});
		for (let item of this.confEvenement.typeEvenement){
			this.tabEvenement.push({"label": item.name, "value": item.name});
		}
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

    requeteOnInputAladin3ET4(id, quiQuoi){
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
			for (let item of this.responseRequete.hits.hits){
				this.evt.push(item._source.evt);
			}
			this.done = true;
		}, error => console.error(error));
	}

	onSelectedType(event){

	}

	onDeselectedType(event){

	}
}