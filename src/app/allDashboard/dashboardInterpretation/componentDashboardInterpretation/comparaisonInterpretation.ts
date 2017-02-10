/**
*
* ce composant permet d'afficher le module interpretation.
* Il va s'appuyer sur des sous-module pour afficher les données.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgGrid, NgGridItem} from 'angular2-grid';
import {RequetePageListService} from '../../../../service/requeteService';
import {Cookie} from 'ng2-cookies/ng2-cookies';

declare var require: any;

@Component({
	selector: 'comparaisonInterpretation',
	styles: [require('./comparaisonInterpretation.css'), require('../../../../css/cssGlobal.css')],
	template: require('./comparaisonInterpretation.html')
})
export class ComparaisonInterpretation {
	/// images
		private loaderGif: any;
	///

	private done: boolean = false;
	private wait: boolean = false;

	private query: any;
	private sub: any;
	private currentAdresse: string;
	private indexRight: string = "Préproduction-données du jour";
	private indexLeft: string = "Api Interprétation";
	private nameIndexRight: string = "apiInterpretation";
	private responseInterpretation: any = [];
	private confAtelierInterpretation: any;
	private requeteService: RequetePageListService;

	constructor(private route: ActivatedRoute, private router: Router, requeteService: RequetePageListService){
		this.requeteService = requeteService;
		this.loaderGif = require("../../../../images/loaderBB8.gif");
		this.confAtelierInterpretation = require('../../../../conf/confAtelierInterpretation.json');
		this.sub = this.route.params.subscribe(params => {
			this.query = params['QuiQuoi'];
		});
	}
	ngOnInit(){
		var i : number = 0;
		for (let item of this.confAtelierInterpretation.apiInterpretation){
			if (i == 0){
				this.requeteInterpretation(item.addr);
				i += 1;
			}
		}
	}

	chooseIndexRight(name, addr){
		this.indexRight = name;
		this.requeteInterpretation(addr);
	}

	chooseIndexLeft(name, nameNorma){
		this.done = false;
		this.indexLeft = name;
		this.nameIndexRight = nameNorma;
		this.indexRight = this.confAtelierInterpretation[nameNorma][0].name;
		this.requeteInterpretation(this.confAtelierInterpretation[nameNorma][0].addr);
	}

	requeteInterpretation(addr){
		this.currentAdresse = addr;
		this.done = false;
		this.wait = true;
		this.requeteService.getInterpretation(addr, this.query)
		.then(response => {
			this.responseInterpretation = response;
			this.done = true;
			this.wait = false;
		}, error => console.error(error));
	}
}
