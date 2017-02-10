/**
*
* Lorsque l'on appuie sur le bouton de login, une modal s'affiche grâce à ce composant.
* Les fonctions appelées lors du clique sont aussi gérer par ce composant.
*
*/

/**
 * This is a doc comment for a dynamic module.
 */

import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {RequetePageListService} from '../../service/requeteService';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import myGlobals = require('../../globals');

declare var $: any;
declare var require: any;

@Component({
  selector: 'login',
  styles: [require('./login.css')],
  template: require('./login.html')
})
export class Login {

	private requeteService: RequetePageListService;
	private responseAuthentification: any;
	private connect: string;
	private sub : any;
	private loginInvalid: boolean = false;

	constructor(private route: ActivatedRoute, private router: Router, requeteService: RequetePageListService){
		this.requeteService = requeteService;
	}

	ngOnInit(){
		if (Cookie.get('login') != null){
			(<HTMLInputElement>document.getElementById("usrname")).value = Cookie.get('login');
			// (<HTMLInputElement>document.getElementById("psw")).value = Cookie.get('password');
		}
		this.sub = this.route.params.subscribe(params => {
			this.connect = params["connect"];
			if (this.connect == 'login'){
				$( document ).ready(function() {
    	    		$("#myModal").modal();
				});
			}
			else {
				myGlobals.connect = false;
				let link = ['/home'];
	        	this.router.navigate(link);
			}
		});
	}

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
		// $( document ).ready(function() {
			$('#myModal').modal('hide');
		// });
		let link = ['/home'];
        this.router.navigate(link);
	}
}
