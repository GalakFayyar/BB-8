/// <reference path="../../../../../../typings/leaflet.d.ts"/>

import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import 'leaflet';
import {Map} from 'leaflet';

declare var require: any;

@Component({
	selector: 'map',
	styles: [require('./map.css')],
	template: require('./map.html')
})
export class MapEtabRanker {
	@Input()
	responseRequeteEtabRanker: any;

	private sub: any;
	map: any;
	marker: any;

	private _tileLayer:string = "http://{s}.tile.osm.org/{z}/{x}/{y}.png";
	
	constructor(private route: ActivatedRoute, private router: Router){
	}
	ngOnInit(){
	    this.setMap();
	}

	setMap(){
		this.map = L.map('map',{}).setView([48, 2], 5);
		L.tileLayer(this._tileLayer, {
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>'
		}).addTo(this.map);
        for (let item of this.responseRequeteEtabRanker.hits.hits){
	      if (item._source.adresse.geoloc.precision <= 1){
	        this.marker = L.marker([item._source.pin_geo.lat, item._source.pin_geo.lon],{
	                  icon: L.icon({
	                      iconUrl: require('../../../../../../imagesEtabRanker/marker-icon-green.png'),
	                      iconSize: [25, 41],
	                      iconAnchor: [12, 41]
	                  })
	              }).addTo(this.map)
	      }
	      else if (item._source.adresse.geoloc.precision == 2){
	        this.marker = L.marker([item._source.pin_geo.lat, item._source.pin_geo.lon],{
	                  icon: L.icon({
	                      iconUrl: require('../../../../../../imagesEtabRanker/marker-icon-orange.png'),
	                      iconSize: [25, 41],
	                      iconAnchor: [12, 41]
	                  })
	              }).addTo(this.map)
	      }
	      else if (item._source.adresse.geoloc.precision >= 3){
	        this.marker = L.marker([item._source.pin_geo.lat, item._source.pin_geo.lon],{
	                  icon: L.icon({
	                      iconUrl: require('../../../../../../imagesEtabRanker/marker-icon-red.png'),
	                      iconSize: [25, 41],
	                      iconAnchor: [12, 41]
	                  })
	              }).addTo(this.map)
	      }
	      else{
	        this.marker = L.marker([item._source.pin_geo.lat, item._source.pin_geo.lon]).addTo(this.map);
	          // .bindPopup(item._source.denom_principale);
	      }
	    }
	}
}
