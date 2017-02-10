/*
*
* Ce service permet de faire les requêtes.
*
*/

import {Http, Headers, Response} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';

declare var require: any;

@Injectable()
export class RequeteEtabRanker {
http: Http;

    conf: any;

    private headers = new Headers({
        'Content-Type': 'application/json'
    });

    constructor(http: Http) {
        this.http = http;
        this.conf = require('../conf/conf.json');
    }

    handleError(error: Response) {
    }

    searchElasticSearch(query: string, elastOptions: any){
        var url : string = this.conf.api.urlElasticSearch_seachEtab;
        return this.http.post(url, JSON.stringify({query: elastOptions.query}), { headers: this.headers })
                   .toPromise()
                   .then(response => response.json())
                   .catch(this.handleError);
    }

    searchElasticSearchAVG(query: string, elastOptions: any){
        var url : string = this.conf.api.urlElasticSearch_seachEtab;
        return this.http.post(url, JSON.stringify({from: elastOptions.from, size: elastOptions.size, query: elastOptions.query, aggs: elastOptions.aggs}), { headers: this.headers })
                   .toPromise()
                   .then(response => response.json())
                   .catch(this.handleError);
    }

    searchPhotos(query: string){
        var url : string = this.conf.api.urlElasticSearch_searchPhotos + '?q=_id:' + query;
        return this.http.post(url, JSON.stringify({}), { headers: this.headers })
                   .toPromise()
                   .then(response => response.json())
                   .catch(this.handleError);
    }
}
