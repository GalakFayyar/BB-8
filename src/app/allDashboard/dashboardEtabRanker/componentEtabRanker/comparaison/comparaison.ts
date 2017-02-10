import { Component, Input } from '@angular/core';
import {RequeteEtabRanker} from '../../../../../service/requeteServiceEtabRanker';

declare var require: any;

// import myGlobals = require('../../globals.ts');

// import { LocalDataSource } from 'ng2-smart-table';
// import { Ng2SmartTableModule } from 'ng2-smart-table';
// import { FormControl, FormGroup } from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';


@Component({
  selector: 'comparaison',
  // encapsulation: ViewEncapsulation.None,
  template: require('./comparaison.html'),
  styles: [require('./comparaison.css')]
})

export class Comparaison {
	@Input()
	responseRequeteEtabRanker: any;

	query: string = '';

	settings = {
		pager: {
			perPage: 5
		},
		actions: {
			add : false,
			edit: false,
			delete: false
		},
		columns: {
			id: {
	        	title: 'ID',
	        	type: 'number'
			},
			nom: {
			    title: 'Nom etab.',
			    type: 'string'
			},
			score: {
			    title: 'Score',
			    type: 'number'
			},
			clics: {
			    title: 'nb. de clics',
			    type: 'number'
			},
			precision: {
			    title: 'Précision geocode',
			    type: 'number'
			},
			telephone: {
			    title: 'Présence téléphone',
			    type: 'html'
			},
			rubrique: {
			    title: 'Présence rubrique',
			    type: 'html'
			},
			email: {
			    title: 'Présence e-mail',
			    type: 'html'
			},
			photo: {
			    title: 'Présence photo',
			    type: 'html'
			},
			cri: {
			    title: 'Présence cri',
			    type: 'html'
			},
			geocode: {
			    title: 'Présence geocode',
			    type: 'html'
			},
			site: {
			    title: 'Présence site',
			    type: 'html'
			},
			paiement: {
			    title: 'Présence moyen de paiement',
			    type: 'html'
			},
			menu: {
			    title: 'Présence menu',
			    type: 'html'
			},
			logo: {
			    title: 'Présence logo',
			    type: 'html'
			},
			donneesEnrichies: {
			    title: 'Présence données enrichies',
			    type: 'html'
			},
			voie: {
			    title: 'Présence voie',
			    type: 'html'
			}
		}
	};

	public states: any = [];
	private indexRequete : number = 0;
  	private data: Observable<any>;
	private values: any = [];

	private source : any;

	// source: LocalDataSource = new LocalDataSource();
	private requeteService: RequeteEtabRanker;
	searchEtabElasticSearch : any;
	responseElasticSearch : any;
	responseAllEtab : any;
	private wait : boolean = false;
	private done : boolean = false;

	private client: any;
  	private index: any;
	// algoliasearch = require('algoliasearch');

//// img

	private loaderGif : any;

////

  private GlobalsEtab: string = "nothing";

	constructor(requeteService: RequeteEtabRanker) {
		// this.client = this.algoliasearch('7TM6BC4HX4', '25d76df4b809a012a0b482f96db006a2');
	    // this.index = this.client.initIndex('INT_EtabPub_v2_ranker');
	    this.requeteService = requeteService;
	}

	ngOnInit(){
		var varSearch : any;
    	this.loaderGif = require("../../../../../imagesEtabRanker/loader.gif");
		for (let item of this.responseRequeteEtabRanker.hits.hits){
	   		// this.search(item._source.code_etab, item._source.denom_principale);
			varSearch = item._source.code_etab;
    		this.search(item._source.code_etab);
	    	this.wait = true;
	  	}
		// if (myGlobals.etab != ""){
			// varSearch = myGlobals.etab;
    		// this.search(varSearch.id);
	    	// this.wait = true;
    	// }
	}

  	autocompl(etab){
	    this.states = [];

	    var err: any;
	    var content: any;

	    var tab: any = [];
	    this.data = new Observable(observer => {
	      this.index.search(etab, function(err, content){
	        for (let item of content.hits){
	        	(item.adresse) ? (tab.push({'name': item.libelle + ' - ' + item.adresse.localite + ' - ' + item.codeEtab, 'id' : item.codeEtab})) : (0);
          		(!item.adresse) ? (tab.push({'name': item.libelle + ' - ' + item.codeEtab, 'id' : item.codeEtab})) : (0);
	        }
	        observer.next(tab);
	        return (tab);
	      });
	    });
	    let subscription = this.data.subscribe(
	      value => this.states = value
	    );
	 }
 
	public typeaheadOnSelect(e:any):void {
	    this.search(e.item.id);
	    this.GlobalsEtab = e.item;
	}

	searchElasticSearch(metier, lon, lat){
	       this.done = false;
	    this.searchEtabElasticSearch = metier;
	    if (!this.searchEtabElasticSearch) { return;}
	    let elastOptions = {
	    	"from": this.indexRequete,
	    	"size" : 15,
	    	"query": {
	    		"filtered": {
	    			"query": {
	    				"bool": {
	    					"must": {
	    						"query_string": {
	    							"query": "metier:\"" + metier + "\""
	    						}

	    					}
	    				}
	    			},
	    			"filter": {
	    				"geo_distance": {
	    					"distance": "20km",
	    					"pin_geo": {
	    						"lat": lat,
	    						"lon": lon
	    					}
	    				}
	    			}
	    		}
	    	}
	    };
	    this.requeteService.searchElasticSearchAVG(this.searchEtabElasticSearch, elastOptions)
	      .then(response => {
	        this.responseAllEtab = response;
	        this.makeTab(this.responseAllEtab);
	        this.done = true;
	      }, error => console.error(error));
	}

	makeTab(reponse){
		var tab : any = [];
		for (let item of reponse.hits.hits){
			tab.push({
				'id': item._source.code_etab,
				'nom': item._source.denom_principale,
				'score': item._source.score,
				'photo': (item._source.nb_photo > 0 || item._source.presence_photo_expedia > 0 || item._source.presence_photo_pvi > 0 || item._source.presence_photo_lafourchette > 0 || item._source.presence_photo_leadformance > 0 || item._source.presence_photo_cviv > 0 || item._source.presence_photo_osd > 0 || item._source.presence_photo_pjdoc > 0 || item._source.presence_photo_wiki > 0) ? ('1') : ('0'),
				'rubrique': item._source.est_rubrique,
				'telephone': item._source.presence_telephone,
				'site': item._source.presence_site,
				'paiement': item._source.presence_moyen_de_paiement,
				'clics': item._source.nb_clics,
				'cri': item._source.presence_cri,
				'email': item._source.presence_email,
				'geocode': item._source.est_geocode,
				'menu': item._source.presence_menu,
				'logo': item._source.presence_logo,
				'voie': item._source.presence_voie,
				'donneesEnrichies': item._source.presence_donnees_enrichies,
				'precision': item._source.precision
			});
		}
		this.source = tab;
	}

	onDeleteConfirm(event): void {
		if (window.confirm('Are you sure you want to delete?')) {
		  event.confirm.resolve();
		} else {
		  event.confirm.reject();
		}
	}

	search(event){
		this.wait = true;
	    this.done = false;
	    this.searchEtabElasticSearch = event;
	    if (!this.searchEtabElasticSearch) { return;}
	    let elastOptions = {
	    	"query": {
	    		"filtered": {
	    			"query": {
	    				"match": {
	    					"code_etab": this.searchEtabElasticSearch
	    				}
	    			}
	    		}
	    	}
	    };
	    this.requeteService.searchElasticSearch(this.searchEtabElasticSearch, elastOptions)
	      .then(response => {
	        this.responseElasticSearch = response;
	        for (let item of response.hits.hits){
  				this.searchElasticSearch(item._source.metier, item._source.pin_geo.lon, item._source.pin_geo.lat);
	        }
	      }, error => console.error(error));
  	}

  	previousInRequete(){
  		if (this.indexRequete != 0){
	  		this.indexRequete -= 10;
	  		for (let item of this.responseRequeteEtabRanker.hits.hits){
		   		// this.search(item._source.code_etab, item._source.denom_principale);
	    		this.search(item._source.code_etab);
		    	this.wait = true;
		  	}
  		}
  	}
  	nextInRequete(){
  		this.indexRequete += 10;
  		for (let item of this.responseRequeteEtabRanker.hits.hits){
	   		// this.search(item._source.code_etab, item._source.denom_principale);
    		this.search(item._source.code_etab);
	    	this.wait = true;
	  	}
  	}
}