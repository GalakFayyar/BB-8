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
export class DataVisualisationService {

    private conf: any;

    constructor(private http: Http) {
        this.conf = require('../conf/conf.json');
    }      

    handleError(error: Response) {
    }

    getRequest(query: string) {
        let headers = new Headers({
            'Content-Type' : "application/json",
            'Authorization': "Basic " + btoa("root:root")
        });
        var url: string = this.conf.api.dataVisualisationQuery + query + '/100';
        return this.http.get(url, {headers : headers}).map((res: Response) => res.json());
    }

    postDocumentRequest(body: string) {
        let headers = new Headers({
            'Content-Type' : "application/json",
            'Authorization': "Basic " + btoa("root:root")
        });
        var url: string = this.conf.api.dataVisualisationDocument;
        return this.http.post(url, body, {headers : headers}).map((res: Response) => res.json());
    }

    postCommandRequest(body: string) {
        let headers = new Headers({
            'Content-Type' : "application/json",
            'Authorization': "Basic " + btoa("root:root")
        });
        var url: string = this.conf.api.dataVisualisationCommand;
        return this.http.post(url, body, {headers : headers}).map((res: Response) => res.json());
    }

    deleteElemByRid(rid: string) {
        let headers = new Headers({
            'Content-Type' : "application/json",
            'Authorization': "Basic " + btoa("root:root")
        });
        var url: string = this.conf.api.dataVisualisationDocument + rid;
        return this.http.delete(url, {headers : headers}).map((res: Response) => res.json());
    }
}