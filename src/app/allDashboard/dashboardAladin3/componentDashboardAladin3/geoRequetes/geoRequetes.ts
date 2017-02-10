/**
*
* Ce composant permet d'afficher geoRequête.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from "@angular/platform-browser";

declare var require: any;

@Component({
	selector   : 'geoRequetes',
	styles: [require('./geoRequetes.css'), require('../../../../../css/cssGlobal.css')],
	template: require('./geoRequetes.html')
})
export class GeoRequetes {

	private conf: any;
	private sub : any;
	private urlGeoRequete: any;

	constructor(private domSanitizer : DomSanitizer, private route: ActivatedRoute, private router: Router){
        this.conf = require('../../../../../conf/conf.json');
	}

	ngOnInit(){
		var varCurrentSearch : any;
		this.sub = this.route.params.subscribe(params => {
			console.log(this.conf.api.geoRequetes + params['QuiQuoi']);
			this.urlGeoRequete = this.domSanitizer.bypassSecurityTrustResourceUrl(this.conf.api.geoRequetes + params['QuiQuoi']);
		});
	}
}