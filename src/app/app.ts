/**
*
* Ce composant est le composant pricipal.
* Tous les autres composants déscendes de celui-ci.
* Celui-ci permet d'afficher la barre du haut et le footer.
* Tous les autres composants vont être intégrer dans le corp de ce composant, par la route au niveau de <router-outlet></router-outlet>.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RequetePageListService} from '../service/requeteService';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import myGlobals = require('../globals');

declare var $: any;
declare var require: any;

@Component({
  selector   : 'app',
  styles: [require('./app.css'), require('../css/cssGlobal.css')],
  template: require('./app.html')
})
export class AppComponent {
	// images
		private logoBB8 : any;
		private logoOPTBB8: any;
		private logoOPTBB81: any;
		private logoOPTBB82: any;
		private logoOPTBB83: any;
		private logoOPTBB84: any;
		private logoOPTBB85: any;
		private logoOPTBB86: any;
		private logoOPTBB87: any;
		private logoOPTBB88: any;
		private logoOPTBB89: any;
		private logoOPTBB810: any;
		private logoOPTBB811: any;
		private logoOPTBB812: any;
		private logoOPTBB813: any;
		private logoOPTBB814: any;
		private logoOPTBB815: any;
		private logoOPTBB816: any;
		private logoOPTBB817: any;
		private logoOPTBB818: any;
		private logoOPTBB819: any;
		private logoOPTBB820: any;
		private logoOPTBB821: any;
		private logoOPTBB822: any;
		private logoOPTBB823: any;
		private logoOPTBB824: any;
		private tabLogoOPTBB8: any = [];
	//

	// variables
		private requeteService: RequetePageListService;
	    private conf: any;
	    private confOptionsBB8: any;
	    private confVersion: any;
		private connect: boolean = false;
		private login: string = "";

		//// login
			private responseAuthentification: any;
			private loginInvalid: boolean = false;
		////

		private optBB8: boolean = false;

		private indexVersion: number = 0;
		private currentVerion: any = [];


	//

	constructor(private router: Router, private route: ActivatedRoute, requeteService: RequetePageListService){
		this.requeteService = requeteService;
        this.conf = require('../conf/conf.json');
        this.confOptionsBB8 = require('../conf/optionsBB8.json');
        this.confVersion = require('../conf/versions.json');
	}
	
	ngOnInit(){
		this.optBB8 = false;
		this.loadVersion();
		if (Cookie.get('login') != null){
			(<HTMLInputElement>document.getElementById("usrname")).value = Cookie.get('login');
			// (<HTMLInputElement>document.getElementById("psw")).value = Cookie.get('password');
		}
		// this.logoBB8 = require("../images/bb8.png");
		this.logoBB8 = require("../images/bb8Noel.png");
		this.logoOPTBB8 = require("../images/bb8.png");
		
		/// optBB8

		this.tabLogoOPTBB8.push({'img': this.confOptionsBB8.bb8.logoOPTBB81});
		this.tabLogoOPTBB8.push({'img': this.confOptionsBB8.bb8.logoOPTBB82});
		this.tabLogoOPTBB8.push({'img': this.confOptionsBB8.bb8.logoOPTBB83});
		this.tabLogoOPTBB8.push({'img': this.confOptionsBB8.bb8.logoOPTBB84});
		this.tabLogoOPTBB8.push({'img': this.confOptionsBB8.bb8.logoOPTBB85});
		this.tabLogoOPTBB8.push({'img': this.confOptionsBB8.bb8.logoOPTBB86});
		this.tabLogoOPTBB8.push({'img': this.confOptionsBB8.bb8.logoOPTBB87});
		this.tabLogoOPTBB8.push({'img': this.confOptionsBB8.bb8.logoOPTBB88});
		this.tabLogoOPTBB8.push({'img': this.confOptionsBB8.bb8.logoOPTBB89});
		this.tabLogoOPTBB8.push({'img': this.confOptionsBB8.bb8.logoOPTBB810});
		this.tabLogoOPTBB8.push({'img': this.confOptionsBB8.bb8.logoOPTBB811});
		this.tabLogoOPTBB8.push({'img': this.confOptionsBB8.bb8.logoOPTBB812});
		this.tabLogoOPTBB8.push({'img': this.confOptionsBB8.bb8.logoOPTBB813});
		this.tabLogoOPTBB8.push({'img': this.confOptionsBB8.bb8.logoOPTBB814});
		this.tabLogoOPTBB8.push({'img': this.confOptionsBB8.bb8.logoOPTBB815});
		this.tabLogoOPTBB8.push({'img': this.confOptionsBB8.bb8.logoOPTBB816});
		this.tabLogoOPTBB8.push({'img': this.confOptionsBB8.bb8.logoOPTBB817});
		this.tabLogoOPTBB8.push({'img': this.confOptionsBB8.bb8.logoOPTBB818});
		this.tabLogoOPTBB8.push({'img': this.confOptionsBB8.bb8.logoOPTBB819});
		this.tabLogoOPTBB8.push({'img': this.confOptionsBB8.bb8.logoOPTBB820});
		this.tabLogoOPTBB8.push({'img': this.confOptionsBB8.bb8.logoOPTBB821});
		this.tabLogoOPTBB8.push({'img': this.confOptionsBB8.bb8.logoOPTBB822});
		this.tabLogoOPTBB8.push({'img': this.confOptionsBB8.bb8.logoOPTBB823});
		this.tabLogoOPTBB8.push({'img': this.confOptionsBB8.bb8.logoOPTBB824});
		/////
		
		if (myGlobals.connect == true){
			this.connect = true;
		}
	}

	/// login
	/**
	* Comment for method checkLogin.
  	*/
	checkLogin() {
		let elastOptions = {
			"password": (<HTMLInputElement>document.getElementById("psw")).value,
			"username" : (<HTMLInputElement>document.getElementById("usrname")).value
        };
		this.requeteService.getAuthentification(elastOptions)
		.then(response => {
			this.responseAuthentification = response;
			if (this.responseAuthentification){
				myGlobals.login = this.responseAuthentification.username;
				myGlobals.connect = true;
				this.getActions(myGlobals.login, this.responseAuthentification.token);
				this.loginValid();
				this.connect = true;
				this.login = myGlobals.login;
				$('#myModal').modal('hide');
			}
			else {
				this.loginInvalid = true;
				myGlobals.connect = false;
			}
		}, error => console.error(error));
	}

	getActions(usrname, token){
		this.requeteService.getDroitAuthentification(usrname, token)
            .subscribe(
            	getActions => myGlobals.actions = getActions.actions,
            	err => console.error(err)
        );
	}

	loginValid(){
		if ((<HTMLInputElement>document.getElementById("checkbox")).checked == true){
			Cookie.set('login', (<HTMLInputElement>document.getElementById("usrname")).value, 10);
			// Cookie.set('password', (<HTMLInputElement>document.getElementById("psw")).value, 10);
		}
		else {
			Cookie.delete('login');
			// Cookie.delete('password');
		}
	}

	logout() {
		myGlobals.actions = [];
		myGlobals.login = "";
		myGlobals.connect = false;
		this.connect = false;
	}
	////

	getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

	optionBB8(){
		var number = this.getRandomInt(0, 23);
		var cpt: number = 0;
		for (let item of this.tabLogoOPTBB8){
			if (cpt == number){
				this.logoOPTBB8 = item.img;
			}
			cpt += 1;
		}
		if (this.optBB8 == false){
			this.optBB8 = true;
		}
		else if (this.optBB8 == true){
			this.optBB8 = false;
		}
	}

	loadVersion(){
		this.currentVerion = [];
		var cpt : number = 0;
		for (let item of this.confVersion){
			if (cpt == this.indexVersion){
				this.currentVerion.push(item);
			}
			cpt += 1;
		}
		if (this.currentVerion == "" && this.indexVersion == -1){
			this.prevVersion();
		}

		if (this.currentVerion == "" && this.indexVersion != -1){
			this.nextVersion();
		}
	}

	prevVersion(){
		this.indexVersion += 1;
		this.loadVersion();
	}

	nextVersion(){
		this.indexVersion -= 1;
		this.loadVersion();
	}

	reniVersion(){
		this.indexVersion = 0;
		this.loadVersion();
	}
}
