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
export class RequetePageListService {
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

    requeteOnInput(query: string, elastOptions: any, indexElastic: string){
        var url : string = this.conf.api.adresse + indexElastic + "//_search";
        return this.http.post(url, JSON.stringify({query: elastOptions.query, sort: elastOptions.sort, size: elastOptions.size, from: elastOptions.from}), { headers: this.headers })
                   .toPromise()
                   .then(response => response.json())
                   .catch(this.handleError);
    }

    requeteOnInputEtablissement(query: string, elastOptions: any){
              var url : string = this.conf.api.prosPopulaire;
        return this.http.post(url, JSON.stringify({query: elastOptions.query, size: elastOptions.size, from: elastOptions.from}), { headers: this.headers })
                   .toPromise()
                   .then(response => response.json())
                   .catch(this.handleError);
    }

    requeteOnInputUrlRub(query: string, elastOptions: any, indexElastic: string){
        var url : string = this.conf.api.adresse_port_10400 + indexElastic + "//_search";
        return this.http.post(url, JSON.stringify({query: elastOptions.query, sort: elastOptions.sort, size: elastOptions.size, from: elastOptions.from}), { headers: this.headers })
                   .toPromise()
                   .then(response => response.json())
                   .catch(this.handleError);
    }

    requeteDashboard(query: string, elastOptions: any, indexElastic: string){
        var url : string = this.conf.api.adresse + '/' + indexElastic;
        return this.http.post(url, JSON.stringify({query: elastOptions.query, sort: elastOptions.sort, size: elastOptions.size, from: elastOptions.from}), { headers: this.headers })
                   .toPromise()
                   .then(response => response.json())
                   .catch(this.handleError);
    }

    requeteForConfig(elastOptions: any){
        var url : string = this.conf.api.r2d2Config;
        return this.http.post(url, JSON.stringify({query: elastOptions.query, filtered: elastOptions.filtered}), { headers: this.headers })
                   .toPromise()
                   .then(response => response.json())
                   .catch(this.handleError);
    }

    getApiInterpretation(query: string) {
        var url: string = this.conf.api.adresseIntForInterpretation + "/outils/r2d2/php/get_api_interpretation.php?affichage=&serverId=32&terme=" + query;
        return this.http.get(url).map((res: Response) => res.json());
    }

    getAuthentification(elastOptions: any) {
        var url : string = this.conf.api.getAuthentification;
        return this.http.post(url, JSON.stringify({password: elastOptions.password, username: elastOptions.username}), { headers: this.headers })
                   .toPromise()
                   .then(response => response.json())
                   .catch(this.handleError);
    }

    getDroitAuthentification(query: string, token: string) {
      var config : any = {headers:  {
                        'auth-token': token
                    }
                }
        var url: string = this.conf.api.getDroitAuthentification + query;
        return this.http.get(url, config).map((res: Response) => res.json());
    }

    searchProPop(query: string, elastOptions: any){
      var url : string = this.conf.api.prosPopulaire;
        return this.http.post(url, JSON.stringify({filter: elastOptions.filter, sort: elastOptions.sort, size: elastOptions.size}), { headers: this.headers })
                   .toPromise()
                   .then(response => response.json())
                   .catch(this.handleError);
    }

    requeteCriEtMarques_Cri(query: string, elastOptions: any){
        var url : string = this.conf.api.adresse_port_10400 + "/critere_metier/critere/_search";
        return this.http.post(url, JSON.stringify({filter: elastOptions.filter, size: elastOptions.size}), { headers: this.headers })
                   .toPromise()
                   .then(response => response.json())
                   .catch(this.handleError);
    }

    requeteCriEtMarques_Marques(query: string, elastOptions: any){
        var url : string = this.conf.api.adresse_port_10400 + "/critere_metier/critere/_search";
        return this.http.post(url, JSON.stringify({query: elastOptions.query, filter: elastOptions.filter, size: elastOptions.size}), { headers: this.headers })
                   .toPromise()
                   .then(response => response.json())
                   .catch(this.handleError);
    }

    requeteRubrique(query: string, elastOptions: any){
        var url : string = this.conf.api.adresse_port_10400 + "/bo_er_metier/rubrique/_search";
        return this.http.post(url, JSON.stringify({query: elastOptions.query, filter: elastOptions.filter, size: elastOptions.size}), { headers: this.headers })
                   .toPromise()
                   .then(response => response.json())
                   .catch(this.handleError);
    }

    getInterpretation(addr: string, query){
      var url: string = this.conf.api.adresseIntForInterpretation + addr + query;
      return this.http.get(url)
                 .toPromise()
                 .then(response => response.json())
                 .catch(this.handleError);
    }

    requeteEtabRanker(siret: string, elastOptions: any){
        var url : string = this.conf.api.adresse + "/csp_csv_last/_search";
        return this.http.post(url, JSON.stringify({query: elastOptions.query}), { headers: this.headers })
                   .toPromise()
                   .then(response => response.json())
                   .catch(this.handleError);
    }

    requeteApiContexte(query: string, size) {
      var config : any = [{
        'mots': query,
        'size': size,
        'type': "json"
      }]
      var url: string = this.conf.api.urlApiContexte.replace("REQUETEAREMPLACER", query);
      return this.http.get(url, config).map((res: Response) => res.json());
    }
}