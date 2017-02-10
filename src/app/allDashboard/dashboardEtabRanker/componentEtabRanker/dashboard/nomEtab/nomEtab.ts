import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

declare var require: any;

@Component({
	selector: 'nomEtab',
	styles: [require('./nomEtab.css')],
	template: require('./nomEtab.html')
})
export class NomEtab {
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
