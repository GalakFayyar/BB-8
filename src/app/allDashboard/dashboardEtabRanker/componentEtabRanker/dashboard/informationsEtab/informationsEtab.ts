import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

declare var require: any;

@Component({
	selector: 'informationsEtab',
	styles: [require('./informationsEtab.css')],
	template: require('./informationsEtab.html')
})
export class InformationsEtab {
	@Input()
	responseRequeteEtabRanker: any;
	
	private sub: any;
	
	constructor(private route: ActivatedRoute, private router: Router){

	}
	ngOnInit(){
		this.sub = this.route.params.subscribe(params => {
		});
	}
}
