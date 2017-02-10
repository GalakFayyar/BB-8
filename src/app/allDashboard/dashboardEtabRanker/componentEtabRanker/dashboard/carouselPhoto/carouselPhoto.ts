import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

declare var require: any;

@Component({
	selector: 'carouselPhoto',
	styles: [require('./carouselPhoto.css')],
	template: require('./carouselPhoto.html')
})
export class CarouselPhoto {
	@Input()
	responseRequeteEtabRanker: any;
	
	private sub: any;
	//// img
	  private imgCommerce: string;
	  private imgService: string;
	  private imgPublic: string;
	  private imgMaison: string;
	  private imgB2B: string;
	  private currentImg: string;
	  private imgNothing: string;
	/////
	  private img: any = [];
	  
	  private index: number = 0;
	  private nbPhoto: number = 0;

	
	constructor(private route: ActivatedRoute, private router: Router){

	}

	ngOnInit(){
	    this.imgCommerce = require("../../../../../../imagesEtabRanker/commerce.png");
	    this.imgService = require("../../../../../../imagesEtabRanker/service.png");
	    this.imgPublic = require("../../../../../../imagesEtabRanker/public.png");
	    this.imgMaison = require("../../../../../../imagesEtabRanker/maison.png");
	    this.imgB2B = require("../../../../../../imagesEtabRanker/b2b_icon.png");
	    this.imgNothing = require("../../../../../../imagesEtabRanker/nothing.png");
	    
	    this.img.push({'img': this.imgCommerce});
	    this.img.push({'img': this.imgService});
	    this.img.push({'img': this.imgPublic});
	    this.img.push({'img': this.imgMaison});
	    this.img.push({'img': this.imgB2B});

	    this.currentImg = this.imgCommerce;
	    this.nbPhoto = 4;
	}

	previous(){
		var cpt: number = 0;
		(this.index == 0) ? (this.index = this.nbPhoto) : (this.index -= 1);
		for (let item of this.img){
			(cpt == this.index) ? (this.currentImg = item.img) : 0;
			cpt += 1;
		}
	}

	next(){
		var cpt: number = 0;
		(this.index == this.nbPhoto) ? (this.index = 0) : (this.index += 1);
		for (let item of this.img){
			(cpt == this.index) ? (this.currentImg = item.img) : 0;
			cpt += 1;
		}
	}
}
